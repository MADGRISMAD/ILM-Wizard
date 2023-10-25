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
  const jsonidentifiers = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
  );
  return JSON.parse(jsonidentifiers);
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
        idSet.size === idSet.add(data[key][j].value).size;
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
            response[key][k].value === data[key][j].value;
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
  const { envId, infId, regionId } = req.body;
  const parentId = req.body.parentId || '';
  const rawData = loadCustomConfigs();
  const jsonidentifiers = sortDuplicates(
    rawData,
    envId,
    infId,
    regionId,
    parentId,
  );
  const jsonidentifiersLength = jsonidentifiers[id]
    ? jsonidentifiers[id].length
    : 0;
  var response = [];
  // If it is a new config, then add it
  if (jsonidentifiersLength === 0) {
    jsonidentifiers[id] = data;
    response = data;
  } else {
    for (let i = 0; i < jsonidentifiers[id].length; i++) {
      const parentId = jsonidentifiers[id][i].parentId || '';
      // If there is no data, then delete all the remaining
      if (data.length === 0) {
        jsonidentifiers[id].splice(i, jsonidentifiers[id].length - i);
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
        // console.log(i,j);
        if (jsonidentifiers[id][i].value === data[j].value) {
          jsonidentifiers[id][i] = data[j];
          response.push(data[j]);
          data.splice(j, 1);
          break;
        }
        // If it does not exist, then delete
        if (j === data.length - 1) {
          jsonidentifiers[id].splice(i, 1);
          i--;
        }
      }
    }
    // // The remaining data is new, so add it
    jsonidentifiers[id] = jsonidentifiers[id].concat(data);
    response = response.concat(data);
  }
  saveCustomConfigs(jsonidentifiers);
  // return the new data
  res
    .status(200)
    .json({ code: 'OK', label: id, object: response, message: '' });
};

const saveCustomConfigs = (jsonidentifiers) => {
  // write the new data in the JSON file
  fs.writeFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
    JSON.stringify(jsonidentifiers),
  );
  return true;
};

const toggleCustomConfig = (req, res) => {
  const id = req.params.id;
  const { value, label, envId, infId, regionId } = req.body;
  const parentId = req.body.parentId || '';
  const configs = loadCustomConfigs();
  var response = false;

  const jsonData = sortDuplicates(configs, envId, infId, regionId, parentId);
  for (let i = 0; i < jsonData[id].length; i++) {
    const envIdJson = jsonData[id][i].envId || false;
    const infIdJson = jsonData[id][i].infId || false;
    const regionIdJson = jsonData[id][i].regionId || false;
    if (jsonData[id][i].value === value && envIdJson === envId && infIdJson === infId && regionIdJson === regionId) {
      jsonData[id][i].isEnabled = !jsonData[id][i].isEnabled;
      response = jsonData[id][i].isEnabled;
      break;
    }
    if (i === jsonData[id].length - 1) {
      jsonData[id].push({
        value: value,
        label: label,
        isEnabled: false,
        envId: envId,
        infId: infId,
        regionId: regionId,
        parentId: parentId,
      });
      break;
    }
  }
  // console.log(jsonData);
  saveCustomConfigs(jsonData);

  res.send(response);
};

module.exports = {
  getConfigs,
  getCustomConfigs,
  setCustomConfigs,
  toggleCustomConfig,
};
