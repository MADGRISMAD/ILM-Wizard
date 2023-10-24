const fs = require('fs');
const path = require('path');
const {db} = require("../services/mongodb.service");

// sends delivery options to the client
async function getDeliveryOptions(req, res, next) {  
  try{
    const deliveryOptions = await loadDeliveryOptions();
    if(deliveryOptions)
      res.status(200).json(deliveryOptions);
    else
      res.status(404).json({message: "Delivery options not found"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Couldn't retrieve delivery options"})
  }
}
// Function that retrieves the delivery options from MongoDB
async function loadDeliveryOptions() {
    const rawDeliveryOptionsData = await db.collection('_global_cat_delivery_options').find().toArray();
    const DeliveryOptionsFirstIndex = 0;
    return rawDeliveryOptionsData[DeliveryOptionsFirstIndex].devOptions;
}

// sends VDC options to the client
async function getVdcOptions(req, res, next) {  
  try{
    const vdcOptions = await loadVdcOptions();
    if(vdcOptions)
      res.status(200).json(vdcOptions);
    else
      res.status(404).json({message: "vdc options not found"});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Couldn't retrieve vdc options"})
  }
}
// Function that retrieves the delivery options from MongoDB
async function loadVdcOptions() {
    const rawVdcOptionsData = await db.collection('_global_cat_vdc_options').find().toArray();
    const VdcOptionsFirstIndex = 0;
    return rawVdcOptionsData[VdcOptionsFirstIndex].vdcOptions;
}

module.exports = { getDeliveryOptions, getVdcOptions };
