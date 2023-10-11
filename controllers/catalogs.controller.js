const fs = require('fs');
const path = require('path');

const loadVmwareConfigs = () => {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_vmware_configs.json'));
  return JSON.parse(rawData);
}

const loadOheConfigs = () => {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_ohe_configs.json'));
  return JSON.parse(rawData);
}


const getConfigsOHE = (req, res) => {
  const configs = loadOheConfigs();
  res.status(200).json({ code: "OK", object: configs, message: "" });
}

const getConfigsVMWare = (req, res) => {
  const configs = loadVmwareConfigs();
  res.status(200).json({ code: "OK", object: configs, message: "" });
}

module.exports = {getConfigsOHE, getConfigsVMWare}
