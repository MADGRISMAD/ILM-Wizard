const fs = require('fs');
const path = require('path');

// Loads VMWare configs from json file
const loadVmwareConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_vmware_configs.json'),
  );
  return JSON.parse(rawData);
};
// Load OHE Configs from json file
const loadOheConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_ohe_configs.json'),
  );
  return JSON.parse(rawData);
};

// Load AZ Configs from json file
const loadAZConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_az_configs.json'),
  );

  return JSON.parse(rawData);
};

// Load Bridge Domain Configs from json file
const loadBridgeDomainConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_bd_configs.json'),
  );

  return JSON.parse(rawData);
};

// Get all configs from json file
const getConfigsOHE = (req, res) => {
  const configs = loadOheConfigs();
  res.status(200).json({ code: 'OK', object: configs, message: '' });
};

// Get all Vmware configs from json file
const getConfigsVMWare = (req, res) => {
  const configs = loadVmwareConfigs();
  res.status(200).json({ code: 'OK', object: configs, message: '' });
};

// Get all AZ configs from json file
const getAZ = (req, res) => {
  const configs = loadAZConfigs().availabilityZones;
  const serviceClasses = req.body.serviceClasses;
  const clusterTypes = req.body.clusterTypes;
  var data = [];
  configs.forEach((option) => {
    if (
      option.serviceClasses === serviceClasses &&
      option.clusterTypes === clusterTypes
    ) {
      data.push(option);
    }
  });

  res.status(200).json({ code: 'OK', object: data, message: '' });
};

// Get all Bridge Domain configs from json file
const getBridgeDomain = (req, res) => {
  const configs = loadBridgeDomainConfigs().bridgeDomains;
  const sites = req.body.sites;
  const distributions = req.body.distributions;
  var data = [];
  configs.forEach((option) => {
    if (option.sites === sites && option.distributions === distributions) {
      data.push(option);
    }
  });
  res.status(200).json({ code: 'OK', object: data, message: '' });
};

const loadCustomConfigs = () => {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
  );
  return JSON.parse(rawData);
};

const getCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = loadCustomConfigs(id);

  res.status(200).json({ code: 'OK', object: data, message: '' });
};

const setCustomConfigs = (req, res) => {
  const id = req.params.id;
  const data = JSON.parse(req.body.data);
  const rawData = loadCustomConfigs();

  rawData[id] = data;

  // write the new data in the JSON file
  fs.writeFileSync(
    path.join(__dirname, 'jsons/_global_custom_configs.json'),
    JSON.stringify(rawData),
  );
  // return the new data
  res.status(200).json({ code: 'OK', object: rawData[id], message: '' });
};

module.exports = {
  getConfigsOHE,
  getConfigsVMWare,
  getAZ,
  getBridgeDomain,
  getCustomConfigs,
  setCustomConfigs,
};
