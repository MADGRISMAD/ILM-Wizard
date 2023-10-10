const fs = require('fs');
const path = require('path');

const loadConfigs = () => {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_configs.json'));
  return JSON.parse(rawData);
}



const getConfigs = (req, res) => {
  const configs = loadConfigs();
  res.status(200).json({ code: "OK", object: configs, message: "" });
}

module.exports = {getConfigs}
