const {db} = require("../services/mongodb.service");

// Function to fetch all regions from database (eventually will replace cargarRegiones)
async function loadRegions() {
  const rawRegionsData = await db.collection('_global_regions').find().toArray();
  const regionsFirstIndex = 0;
  return rawRegionsData[regionsFirstIndex].regions;
}

async function regionExists(regionId, mainDocumentId) {
  const query =
  {
    _id: mainDocumentId,
    regions: {
      $elemMatch: {
        _id: regionId
      }
    }
  };

  const projection = {
    'regions.$': 1 // Include only the matching element in the result
  };

  const filteredObject = await db.collection('_global_regions').findOne(query, {projection});
  return filteredObject;
}

async function bodyValid(body){
  const requiredFields = [
    "parent_id",
    "_id",
    "Region",
    "isEnabled"
  ];
  const missingFields = requiredFields.filter(field => !(field in body));
  const result = missingFields.length > 0;
  return result;
}

async function fetchRegions(req, res) {
  try{
    const regions = await loadRegions();
    res.status(200).json({ code: "OK", object: regions, message: "" });
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"Couldn't retrieve regions"})
  }
}

async function fetchRegionById(req, res) {
  try{
    const mainDocumentId = await loadMainDocumentId();
    const regionId = req.params._id;
    console.log(regionId);
    const query = 
    {
      _id: mainDocumentId,
      regions: {
        $elemMatch: { _id: regionId}
      }
    };
    const projection = {
      'regions.$': 1 // Include only the matching element in the result
    };
  
    const filteredObject = await db.collection('_global_regions').findOne(query, {projection});

    // const region = regions.find(r => r._id === regionId);
    if (filteredObject) {
      region = filteredObject.regions[0];
      res.status(200).json({ code: "OK", object: region, message: "Region encontrada" });
    } else {
      res.status(404).json({ code: "NOT_FOUND", message: "Región no encontrada" });
    }
  }
  catch(err){
    res.status(500).json({ code: "ERROR", message: "Region not retrieved", error: err});
  }

}

async function loadMainDocumentId(){
  const rawRegionsData = await db.collection('_global_regions').find().toArray();
  const regionsFirstIndex = 0;
  return rawRegionsData[regionsFirstIndex]._id;
}

async function saveRegions(req, res) {
  try {
    if (await bodyValid(req.body))
      res.status(400).json({code: "ERROR",message:"Faltan campos obligatorios"});
    else{
      const regionId = req.body._id;
      const mainDocumentId = await loadMainDocumentId();
      const regionExistente = await regionExists(regionId, mainDocumentId);
    
      if (regionExistente)
        res.status(409).json({ code: "DUPLICATE", message: "La region con ese identificador ya existe." });
      else{
        const newRegion = req.body;
        if(typeof newRegion._id !== 'string')
          newRegion._id = newRegion._id.toString();

        newRegion.isEnabled = typeof newRegion.isEnabled === 'string' ? newRegion.isEnabled.toLowerCase() === "true" : newRegion.isEnabled;
        const filter = {_id: mainDocumentId};
        const postOperation = {
          $push: {
            regions: newRegion
          }
        };

        const result = await db.collection("_global_regions").updateOne(filter, postOperation);
        if(result.modifiedCount === 0)
          res.status(500).json({ code: "ERROR",message: "Error inesperado, Region no se pudo agregar." })  ;
        else{
          const regiones = await loadRegions();
          res.status(200).json({ code: "OK", object: regiones, message: "Region agregada con éxito." })
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "ERROR", message: "No se pudo agregar la región", error: error });
  }
}

async function editRegions(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const regionId = req.body._id;
    const regionExistente = await regionExists(regionId, mainDocumentId);
    if(!regionExistente)
      return res.status(404).json({ code: "NOT_FOUND", message: "La region no existe." });
    else{
      const filter = {_id: mainDocumentId, "regions._id": regionId};
      //Creating the $set object
      if (typeof req.body.isEnabled === 'string')
        req.body.isEnabled = (req.body.isEnabled.toLowerCase() === "true" || req.body.isEnabled === true);
      let setObject = {};
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          const value = req.body[key];
          setObject[`regions.$.${key}`] = value;
        }
      }

      //Deleting the _id property from the object, since it should not be updated
      if(setObject.hasOwnProperty("regions.$._id"))
        delete setObject["regions.$._id"];

      const updateOperation = {
        $set: setObject
      };

      const result = await db.collection("_global_regions").updateOne(filter, updateOperation);
      if(result.modifiedCount === 0)
        res.status(500).json({ code: "ERROR", message: "No se pudo editar la region", error: error });
      else{
        const regiones = await loadRegions();
        res.status(200).json({ code: "OK", object: regiones, message: "Region editada con éxito." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "ERROR", message: "No se pudo editar la region", error: error });
  }
}

async function deleteRegion(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const regionId = req.params._id;
    const regionExistente = await regionExists(regionId, mainDocumentId);
    if(!regionExistente )
      return res.status(404).json({ code: "NOT_FOUND", message: "La region no existe." });
    else{
      const filter = {_id: mainDocumentId};
      const deleteOperation = {
        $pull: {
          regions: {_id: regionId}
        }
      };

      const result = await db.collection("_global_regions").updateOne(filter, deleteOperation);
      if(result.modifiedCount === 0)
        res.status(500).json({ code: "ERROR", message: "No se pudo eliminar la region", error: error });
      else{
        const regiones = await loadRegions();
        res.status(200).json({ code: "OK", object: regiones, message: "Region eliminada con éxito." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "ERROR", message: "No se pudo eliminar la region", error: error });  
  }
}

async function toggleRegionStatus(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    regionId = req.params._id;
    const regionExistente = await regionExists(regionId, mainDocumentId);
    if(!regionExistente)
      return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
    else{
      const body = req.body;
      if (!('isEnabled' in body)) 
        res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
      else{
        //is Enabled could be a string, so me convert it to boolean in that case
        const isEnabled = typeof body.isEnabled === 'string' ? body.isEnabled.toLowerCase() === "true" : body.isEnabled
        const filter = {_id: mainDocumentId, "regions._id": regionId};
        const updateOperation = {
          $set: {
            "regions.$.isEnabled": isEnabled
          }
        };
        console.log("llegue");
        const result = await db.collection("_global_regions").updateOne(filter, updateOperation);
        const filteredObject = await regionExists(regionId, mainDocumentId);
        const region = filteredObject.regions[0];
        res.status(200).json({ code: "OK", object: region, message: "Estado de la region actualizado con éxito." });      
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "NOT_FOUND", message: "Hubo un error inesperado." });
  }
}

module.exports = {
  fetchRegions,
  fetchRegionById,
  saveRegions,
  editRegions,
  deleteRegion,
  toggleRegionStatus
};

