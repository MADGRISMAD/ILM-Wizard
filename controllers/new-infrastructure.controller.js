const fs = require('fs');
const path = require('path');



// Función para cargar el JSON principal de infraestructuras
function cargarInfraestructuras() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_infrastructures.json'));
  return JSON.parse(rawData).infrastructures;
}

// Función para guardar datos de infraestructuras en el JSON principal
function guardarInfraestructurasData(infrastructures) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_infrastructures.json'), JSON.stringify({ infrastructures }, null, 4));
}

// Obtener todas las infraestructuras
function obtenerInfraestructuras(req, res) {
  const infrastructures = cargarInfraestructuras();
  res.status(200).json({ code: "OK", object: infrastructures, message: "" });
}

// Obtener el catálogo de infraestructuras
function obtenerCatalogoInfraestructuras(req, res) {
  const catalogo = cargarCatalogoInfraestructuras();
  res.status(200).json({ code: "OK", object: catalogo, message: "" });
}

// Guardar una nueva infraestructura
function guardarInfraestructura(req, res) {
  const infrastructures = cargarInfraestructuras();
  infrastructures.push(req.body);
  guardarInfraestructurasData(infrastructures);
  res.status(200).json({ code: "OK", object: infrastructures, message: "Infraestructura agregada con éxito." });
}

// Obtener una infraestructura por su ID
function fetchInfrastructureById(req, res) {
  const infrastructures = cargarInfraestructuras();
  const infraId = req.query._id;

  let infrastructure = infrastructures.find(infra => infra._id === infraId);

  if (!infrastructure) {
    infrastructure = {
      _id: infraId,
      // Puedes agregar propiedades iniciales para la nueva infraestructura aquí
      isEnabled: false
    };
    infrastructures.push(infrastructure);
    guardarInfraestructurasData(infrastructures);
  }

  res.status(200).json({ code: "OK", object: infrastructure, message: "" });
}

// Cambiar el estado de una infraestructura
function toggleInfrastructureStatus(req, res) {
  const infrastructures = cargarInfraestructuras();
  const infraId = req.body._id;

  const isEnabled = req.body.isEnabled === true;

  const existingInfrastructure = infrastructures.find(infra => infra._id === infraId);

  if (existingInfrastructure) {
    existingInfrastructure.isEnabled = isEnabled;
    guardarInfraestructurasData(infrastructures);
    res.status(200).json({ code: "OK", object: existingInfrastructure, message: "Estado de la infraestructura actualizado con éxito." });
  } else {
    res.status(400).json({ code: "ERROR", message: "Infraestructura no encontrada." });
  }
}

module.exports = {
  obtenerInfraestructuras,
  obtenerCatalogoInfraestructuras,
  guardarInfraestructura,
  toggleInfrastructureStatus,

  fetchInfrastructureById
};
