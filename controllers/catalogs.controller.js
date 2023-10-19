const fs = require('fs');
const path = require('path');

// Loads VMWare configs from json file
const loadVmwareConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_vmware_configs.json'),
  );
  return JSON.parse(rawData);
};

// Loads VMWare configs from json file
const loadOheConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_ohe_configs.json'),
  );
  return JSON.parse(rawData);
};

// Get all configs from json file
const getConfigsOHE = (req, res) => {
  var configs = loadOheConfigs();
  const customConfig = loadCustomConfigs();

  const keys = Object.keys(customConfig);
  for (var index in keys) {
    const key = keys[index];
    configs[key] = customConfig[key];
  }

  res.status(200).json({ code: 'OK', object: configs, message: '' });
};

// Get all Vmware configs from json file
const getConfigsVMWare = (req, res) => {
  const configs = loadVmwareConfigs();
  const customConfig = loadCustomConfigs();

  const keys = Object.keys(customConfig);
  for (var index in keys) {
    const key = keys[index];
    configs[key] = customConfig[key];
  }

  res.status(200).json({ code: 'OK', object: configs, message: '' });
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
  const response = checkIds(data, envId, infId, regionId);

  res.status(200).json({ code: 'OK', object: response, message: '' });
};

const checkIds = (data, envId, infId, regionId) => {
  var response = [];
  for (let i = 0; i < data.length; i++) {
    if (
      data[i].envId === envId &&
      data[i].infId === infId &&
      data[i].regionId === regionId
    )
      response.push(data[i]);
  }
  return response;
};

const setCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);
  const rawData = loadCustomConfigs();

  const rawDataLength = rawData[id] ? rawData[id].length : 0;

  // If it is a new config, then add it
  if (rawDataLength === 0) {
    rawData[id] = data;
  } else {
    for (let i = 0; i < rawData[id].length; i++) {
      for (let j = 0; j < data.length; j++) {
        // If its not the actual config, then skips it
        if (
          rawData[id][i].envId != data[j].envId ||
          rawData[id][i].infraId != data[j].infraId ||
          rawData[id][i].regionId != data[j].regionId
        )
          break;

        // If it exists, then update
        if (rawData[id][i].identifier === data[j].identifier) {
          rawData[id][i] = data[j];
          data.splice(j, 1);
          break;
        }
        // If it does not exist, then delete
        if (j === data.length - 1) rawData[id].splice(i, 1);
      }
    }
    // The remaining data is new, so add it
    rawData[id].push(...data);
  }
  saveCustomConfigs(rawData);
  // return the new data
  res
    .status(200)
    .json({ code: 'OK', value: id, object: rawData[id], message: '' });
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
  const { value } = req.body;
  const configs = loadCustomConfigs();
  var response = false;
  for (let i = 0; i < configs[id].length; i++) {
    if (configs[id][i].identifier === value) {
      configs[id][i].isEnabled = !configs[id][i].isEnabled;
      response = true;
      break;
    }
  }

  saveCustomConfigs(configs);

  res.send(response);
};

module.exports = {
  getConfigsOHE,
  getConfigsVMWare,
  getCustomConfigs,
  setCustomConfigs,
  toggleCustomConfig,
};
