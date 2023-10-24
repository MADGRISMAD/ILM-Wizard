const fs = require('fs');
const path = require('path');

const {db} = require("../services/mongodb.service");

// Función para cargar regiones del archivo 
function cargarRegiones() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_regions.json'));
  return JSON.parse(rawData).regions;
}

// Función para guardar regiones en el archivo
function guardarRegiones(regions) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_regions.json'), JSON.stringify({ regions }));
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

// Function to fetch all regions from database (eventually will replace cargarRegiones)
async function loadRegions() {
  const rawRegionsData = await db.collection('_global_regions').find().toArray();
  const regionsFirstIndex = 0;
  return rawRegionsData[regionsFirstIndex].regions;

  // const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_regions.json'));
  // return JSON.parse(rawData).regions;
}

async function fetchRegionById(req, res) {
  try{
    const mainDocumentId = await loadMainDocumentId();
    const regionId = req.query._id;
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

function saveRegions(req, res) {
  const regions = cargarRegiones();

  const regionExistente = regions.find(region =>
    region._id && region._id.toLowerCase() === req.body._id.toLowerCase()
  );

  if (regionExistente) {
    return res.status(409).json({ code: "DUPLICATE", message: "La región con ese identificador ya existe." });
  }
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);
  regions.push(req.body);
  guardarRegiones(regions);
  res.status(200).json({ code: "OK", object: regions, message: "Región agregada con éxito." });
}

function editRegions(req, res) {
  const regions = cargarRegiones();
  const matchedRegionIndex = regions.findIndex(region => region._id === req.body._id);
  if (matchedRegionIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  regions[matchedRegionIndex] = req.body;
  guardarRegiones(regions);
  res.status(200).json({ code: "OK", object: regions, message: "Región editada con éxito." });
}

function deleteRegion(req, res) {
  const regions = cargarRegiones();
  const regionIdentifier = req.params._id;
  const matchedRegionIndex = regions.findIndex(region => region._id === regionIdentifier);
  if (matchedRegionIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  regions.splice(matchedRegionIndex, 1);
  guardarRegiones(regions);
  res.status(200).json({ code: "OK", object: regions, message: "Región eliminada con éxito." });
}

function toggleRegionStatus(req, res) {
  const regions = cargarRegiones(); if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El cuerpo de la petición es inválido." });
  }

  if (!('isEnabled' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
  }

  if (!('_id' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad _id es requerida." });
  }

  const matchedRegionIndex = regions.findIndex(region => region._id === req.body._id);

  if (matchedRegionIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  const isEnabled = typeof req.body.isEnabled === 'string' ? req.body.isEnabled.toLowerCase() === "true" : req.body.isEnabled;
  regions[matchedRegionIndex].isEnabled = isEnabled;
  guardarRegiones(regions);

  res.status(200).json({ code: "OK", object: regions[matchedRegionIndex], message: "Estado de la región actualizado con éxito." });
}

module.exports = {
  fetchRegions,
  fetchRegionById,
  saveRegions,
  editRegions,
  deleteRegion,
  toggleRegionStatus
};

