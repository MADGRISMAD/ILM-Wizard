const fs = require('fs');
const path = require('path');

// Get all Vmware configs from json file
const getConfigs = (req, res) => {
  const customConfig = loadCustomConfigs();
  const { envId, infId, regionId } = req.body;
  const response = sortDuplicates(customConfig, envId, infId, regionId);
  res.status(200).json({ code: 'OK', object: response, message: '' });
};

const loadCustomConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
  );
  return JSON.parse(rawData);
};

const sortDuplicates = (data, envId, infId, regionId, parentId = '') => {
  var idSet = new Set();
  var response = {};
  // Check for duplicates
  const keys = Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    response[key] = [];
    for (let j = 0; j < data[key].length; j++) {
      const hasDuplicate =
        idSet.size === idSet.add(data[key][j].identifier).size;
      let basicCond =
        data[key][j].envId === envId &&
        data[key][j].infId === infId &&
        data[key][j].regionId === regionId &&
        data[key][j].parentId === parentId;

      if (hasDuplicate) {
        // Get first duplicate and eliminate it
        for (let k = 0; k < response[key].length; k++) {
          let complexCond =
            basicCond &&
            response[key][k].identifier === data[key][j].identifier;
          if (complexCond) {
            response[key].splice(k, 1);
            break;
          }
        }
      }
      let defaultCond =
      !data[key][j].envId && !data[key][j].infId && !data[key][j].regionId;
      if (basicCond || defaultCond) response[key].push(data[key][j]);
    }
  }

  return response;
};

const getCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = loadCustomConfigs();
  const { envId, infId, regionId } = req.body;
  const parentId = req.params.parentId || '';
  const response = sortDuplicates(data, envId, infId, regionId, parentId)[id];
  res.status(200).json({ code: 'OK', object: response, message: '' });
};

const setCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);
  const rawData = loadCustomConfigs();

  const rawDataLength = rawData[id] ? rawData[id].length : 0;
  var response = [];
  // If it is a new config, then add it
  if (rawDataLength === 0) {
    rawData[id] = data;
  } else {
    for (let i = 0; i < rawData[id].length; i++) {
      const envId = rawData[id][i].envId;
      const infId = rawData[id][i].infId;
      const regionId = rawData[id][i].regionId;
      const parentId = rawData[id][i].parentId;
      // If there is no data, then delete all the remaining
      if (data.length === 0) {
        rawData[id].splice(i, rawData[id].length - i);
        break;
      }
      for (let j = 0; j < data.length; j++) {
        const cond =
          envId != data[j].envId ||
          infId != data[j].infId ||
          regionId != data[j].regionId ||
          parentId != data[j].parentId;
        // If its not the actual config, then skips it
        if (cond) break;

        // If it exists, then update
        if (rawData[id][i].identifier === data[j].identifier) {
          rawData[id][i] = data[j];
          response.push(data[j]);
          data.splice(j, 1);
          break;
        }
        // If it does not exist, then delete
        if (j === data.length - 1) {
          rawData[id].splice(i, 1);
          i--;
        }
      }
    }
    // // The remaining data is new, so add it
    rawData[id] = rawData[id].concat(data);
    response = response.concat(data);
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
