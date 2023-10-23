const fs = require('fs');
const path = require('path');

// Get all Vmware configs from json file
const getConfigs = (req, res) => {
  const customConfig = loadCustomConfigs();
  const { envId, infId, regionId } = req.body;
  var idSet = new Set();
  var response = {};
  // Check for duplicates
  const keys = Object.keys(customConfig);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    response[key] = [];
    for (let j = 0; j < customConfig[key].length; j++) {
      const hasDuplicate =
        idSet.size === idSet.add(customConfig[key][j].identifier).size;
      if (hasDuplicate) {
        // Get first duplicate and eliminate it
        for (let k = 0; k < response[key].length; k++) {
          const cond =
            response[key][k].identifier === customConfig[key][j].identifier &&
            customConfig[key][j].envId === envId &&
            customConfig[key][j].infId === infId &&
            customConfig[key][j].regionId === regionId;
          if (cond) {
            response[key].splice(k, 1);
            break;
          }
        }
      }

      response[key].push(customConfig[key][j]);
    }
  }
  res.status(200).json({ code: 'OK', object: response, message: '' });
};

const loadCustomConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
  );
  return JSON.parse(rawData);
};

const getCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = loadCustomConfigs()[id];
  const { envId, infId, regionId } = req.body;
  const parentId = req.params.parentId || '';
  const response = checkIds(data, envId, infId, regionId, parentId);
  res.status(200).json({ code: 'OK', object: response, message: '' });
};

const checkIds = (data, envId, infId, regionId, parentId = false) => {
  var response = [];
  for (let i = 0; i < data.length; i++) {
    let cond =
      data[i].envId === envId &&
      data[i].infId === infId &&
      data[i].regionId === regionId;

    if (parentId) cond = cond && data[i].parentId === parentId;
    if (cond) response.push(data[i]);
  }
  return response;
};

const setCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);
  const rawData = loadCustomConfigs();

  const rawDataLength = rawData[id] ? rawData[id].length : 0;
  const response = [];
  // If it is a new config, then add it
  if (rawDataLength === 0) {
    rawData[id] = data;
  } else {
    rawDataLoop: for (let i = 0; i < rawData[id].length; i++) {
      const envId = rawData[id][i].envId;
      const infId = rawData[id][i].infId;
      const regionId = rawData[id][i].regionId;
      const parentId = rawData[id][i].parentId;
      for (let j = 0; j < data.length; j++) {
        // If its not the actual config, then skips it
        if (
          envId != data[j].envId ||
          infId != data[j].infId ||
          regionId != data[j].regionId ||
          parentId != data[j].parentId
        )
          continue rawDataLoop;

        // If it exists, then update
        if (rawData[id][i].identifier === data[j].identifier) {
          rawData[id][i] = data[j];
          response.push(data[j]);
          data.splice(j, 1);
          continue rawDataLoop;
        }
        // If it does not exist, then delete
        if (j === data.length - 1) {
          rawData[id].splice(i, 1);
          i--;
        }
      }
    }
    // The remaining data is new, so add it
    rawData[id].push(...data);
    response.push(...data);
  }
  saveCustomConfigs(rawData);
  // return the new data
  res
    .status(200)
    .json({ code: 'OK', value: id, object: response, message: '' });
};

const saveCustomConfigs = (rawData) => {
  // write the new data in the JSON file
  fs.writeFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
    JSON.stringify(rawData),
  );
  return true;
};

const toggleCustomConfig = (req, res) => {
  const id = req.params.id;
  const { value, envId, infId, regionId, parentId } = req.body;
  const configs = loadCustomConfigs();
  var response = false;

  var idSet = new Set();
  var newConfig = [];
  var defaultPosition;
  var defaultDuplicated = false;
  for (let i = 0; i < configs[id].length; i++) {
    const hasDuplicate =
      idSet.size === idSet.add(configs[id][i].identifier).size;
    var jsonObject;
    // Updates the custom option if it exists
    if (hasDuplicate) {
      if (configs[id][i].identifier === value) {
        defaultDuplicated = true;
        configs[id][i].isEnabled = !configs[id][i].isEnabled;
      }
      jsonObject = { ...configs[id][i], envId, infId, regionId, parentId };
    } else {
      // Gets the default option
      if (configs[id][i].identifier === value) defaultPosition = i;
      jsonObject = { ...configs[id][i] };
    }

    newConfig.push(jsonObject);
    // If it is the last element, then it adds the new config
    if (i === configs[id].length - 1 && !defaultDuplicated) {
      const defaultObject = configs[id][defaultPosition];
      defaultObject.isEnabled = false;
      newConfig.push({
        ...defaultObject,
        envId: envId,
        infId: infId,
        regionId: regionId,
        parentId: parentId,
      });
    }
  }

  configs[id] = newConfig;
  saveCustomConfigs(configs);

  res.send(response);
};

module.exports = {
  getConfigs,
  getCustomConfigs,
  setCustomConfigs,
  toggleCustomConfig,
};
