const fs = require('fs');
const path = require('path');
function getDeliveryOptions(req, res, next) {
  const deliveryOptions = loadDeliveryOptions();
  var deliveryOptionsArray = new Array();
  deliveryOptions.forEach((option) => {
    deliveryOptionsArray.push(option);
  });
  res.send(deliveryOptionsArray);
}

function loadDeliveryOptions() {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_cat_delivery_options.json'),
  );
  return JSON.parse(rawData).devOptions;
}

function getVdcOptions(req, res) {
  const vdcOptions = loadVdcOptions();
  var vdcOptionsArray = new Array();
  vdcOptions.forEach((option) => {
    vdcOptionsArray.push(option);
  });
  res.send(vdcOptionsArray);
}

function loadVdcOptions() {
  const rawData = fs.readFileSync(
    path.join(__dirname, 'jsons/_global_cat_vdc_options.json'),
  );
  var VdcOptionsArray = new Array();

  return JSON.parse(rawData).vdcOptions;
}
module.exports = { getDeliveryOptions, getVdcOptions };
