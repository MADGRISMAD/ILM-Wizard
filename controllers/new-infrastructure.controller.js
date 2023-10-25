const fs = require('fs');
const path = require('path');

//database client
const {db} = require("../services/mongodb.service");
const { CANCELLED } = require('dns');

// Función para cargar el JSON principal de infraestructuras
function cargarInfraestructuras() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_infrastructures.json'));
  return JSON.parse(rawData).infraTypes;
}

// Función para cargar el JSON catalogo de infraestructuras
function cargarCatalogoInfraestructuras() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_cat_infrastructures.json'));
  return JSON.parse(rawData).infraTypes;
}

// Función para guardar datos de infraestructuras en el JSON principal
function guardarInfraestructurasData(infraTypes) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_infrastructures.json'), JSON.stringify({ infraTypes }, null, 4));
}

// Obtener todas las infraestructuras
async function obtenerInfraestructuras(req, res) {
  try{
    const infrastructures = await loadInfrastructures();
    if(infrastructures)
      res.status(200).json({ code: "OK", object: infrastructures, message: "" });
    else
      res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve infrastructures" });
  }
  catch (err) {
    res.status(505).json({message: "ERROR", error: err });
  }
}

//Eventualmente reemplazara a cargarInfraestructuras
async function loadInfrastructures()
{
  const rawInfrastructureData = await db.collection('_global_infrastructures').find().toArray();
  const InfrastructureFirstIndex = 0;
  return rawInfrastructureData[InfrastructureFirstIndex].infraTypes;
}


// Obtener el catálogo de infraestructuras
async function obtenerCatalogoInfraestructuras(req, res) {
  try {
    const catalogo = await loadInfrastructuresCatalogue();
    if (catalogo)
      res.status(200).json({ code: "OK", object: catalogo, message: "" });
    else
      res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve infrastructure catalogue" });    
  } catch (error) {
    res.status(505).json({message: "ERROR", error: err });
  }
}

//Eventualmente reemplazara a cargarCatalogoInfraestructuras
async function loadInfrastructuresCatalogue()
{
  const rawInfrastructureData = await db.collection('_global_cat_infrastructures').find().toArray();
  const InfrastructureFirstIndex = 0;
  return rawInfrastructureData[InfrastructureFirstIndex].infraTypes;
}

// Guardar una nueva infraestructura
function guardarInfraestructura(req, res) {
  const infrastructures = cargarInfraestructuras();
  infrastructures.push(req.body);
  guardarInfraestructurasData(infrastructures);
  res.status(200).json({ code: "OK", object: infrastructures, message: "Infraestructura agregada con éxito." });
}

// Obtener una infraestructura por su ID
async function fetchInfrastructureById(req, res) {
  try{ 
    const infrastructureId = req.query._id;
    const parentId = req.query.parentId;
    const regionId = req.query.regionId;
    if(!(infrastructureId && parentId && regionId))
      res.status(400).json({ code: "ERROR", message: "Mandatory query parameters missing (must have _id && parentId && regionId)" });
    else{
      const mainDocumentId = await loadMainDocumentId();
      const query = 
      {
        _id: mainDocumentId,
        infraTypes: {
          $elemMatch: {
            _id: infrastructureId,
            parent_id:parentId,
            region_id: regionId
          }
        }
      };
  
      const projection = {
        'infraTypes.$': 1 // Include only the matching element in the result
      };
    
      const filteredObject = await db.collection('_global_infrastructures').findOne(query, {projection});
      if (filteredObject) {
        const infrastructure = filteredObject.infraTypes[0];
        res.status(200).json({ code: "OK", object: infrastructure, message: "Infraestructura encontrada" });
      } else {
        res.status(404).json({ code: "NOT_FOUND", message: "Infraestructura no encontrada" });
      }
    }
    
  }
  catch(err){
    res.status(500).json({ code: "ERROR", message: "Infraestructure not retrieved", error: err});
  }
}

async function loadMainDocumentId(){
  const rawInfrastructuresData = await db.collection('_global_infrastructures').find().toArray();
  const infrastructuresFirstIndex = 0;
  return rawInfrastructuresData[infrastructuresFirstIndex]._id;
}

// Cambiar el estado de una infraestructura
function toggleInfrastructureStatus(req, res) {

    const infrastructures = cargarInfraestructuras();

    const infraId = req.body._id;
    const parentId = req.body.parent_id;
    const regionId = req.body.region_id;
    const isEnabled = req.body.isEnabled === true;
  
    const existingInfrastructure = infrastructures.some(infra => infra._id === infraId && infra.parent_id === parentId && infra.region_id === regionId);
    console.log("existingInfrastructure: ", existingInfrastructure);
    if (!existingInfrastructure) {
      infrastructures.push({
        _id: infraId,
        parent_id: parentId,  // Guardamos el parent_id
        region_id: regionId,  // Guardamos el region_id
        isEnabled: isEnabled
    });
      
    } else {
      existingInfrastructure.isEnabled = isEnabled;
    }
    guardarInfraestructurasData(infrastructures);
    res.status(200).json({ code: "OK", object: { _id: infraId, isEnabled: isEnabled, parent_id: parentId }, message: "Estado de la infraestructura actualizado con éxito." });
}

module.exports = {
  obtenerInfraestructuras,
  obtenerCatalogoInfraestructuras,
  guardarInfraestructura,
  toggleInfrastructureStatus,

  fetchInfrastructureById
};
