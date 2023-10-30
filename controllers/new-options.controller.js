const { db } = require("../services/mongodb.service");

// Función genérica para cargar opciones
async function loadOptions(collectionName) {
  try {
    const rawData = await db.collection(collectionName).find().toArray();
    if (rawData && rawData.length > 0) {
      return rawData[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw new Error(`Couldn't retrieve options for ${collectionName}`);
  }
}

// Obtiene las opciones de entrega
async function getDeliveryOptions(req, res, next) {
  try {
    const deliveryOptions = await loadOptions('_global_cat_delivery_options');
    if (deliveryOptions) {
      res.status(200).json(deliveryOptions.devOptions);
    } else {
      res.status(404).json({ message: "Delivery options not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Couldn't retrieve delivery options" });
  }

}

// Obtiene las opciones VDC
async function getVdcOptions(req, res, next) {
  try {
    const vdcOptions = await loadOptions('_global_cat_vdc_options');
    if (vdcOptions) {
      res.status(200).json(vdcOptions.vdcOptions);
    } else {
      res.status(404).json({ message: "VDC options not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Couldn't retrieve VDC options" });
  }

}

module.exports = { getDeliveryOptions, getVdcOptions };
