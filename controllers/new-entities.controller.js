const fs = require('fs');
const path = require('path');

// Función para cargar entidades del archivo
function cargarEntidades() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_entities.json'));
  return JSON.parse(rawData).entidades;
}

// Función para guardar entidades en el archivo
function guardarEntidades(entidades) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_entities.json'), JSON.stringify({ entidades }));
}

function obtenerEntidades(req, res) {
  const entidades = cargarEntidades();
  res.status(200).json({ code: "OK", object: entidades, message: "" });
}

function saveEntities(req, res) {
  const entidades = cargarEntidades();
  const entidadExistente = entidades.find(entity =>
    (entity.identifier && entity.identifier.toLowerCase() === req.body.identifier.toLowerCase()) ||
    (entity.companyName && entity.companyName.toLowerCase() === req.body.companyName.toLowerCase())
  );

  if (entidadExistente) {
    return res.status(409).json({ code: "DUPLICATE", message: "La entidad con ese identificador o nombre de compañía ya existe." });
  }

  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);
  entidades.push(req.body);
  guardarEntidades(entidades);

  res.status(200).json({ code: "OK", object: entidades, message: "Entidad agregada con éxito." });
}

function editEntities(req, res) {
  const entidades = cargarEntidades();
  const matchedEntityIndex = entidades.findIndex(entity => entity.identifier === req.body.identifier);

  if (matchedEntityIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
  }

  if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  entidades[matchedEntityIndex] = req.body;
  guardarEntidades(entidades);

  res.status(200).json({ code: "OK", object: entidades, message: "Entidad editada con éxito." });
}

function deleteEntity(req, res) {
  const entidades = cargarEntidades();
  const matchedEntityIndex = entidades.findIndex(entity => entity.identifier === req.body.identifier);

  if (matchedEntityIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
  }

  entidades.splice(matchedEntityIndex, 1);
  guardarEntidades(entidades);

  res.status(200).json({ code: "OK", object: entidades, message: "Entidad eliminada con éxito." });
}

module.exports = {
  obtenerEntidades,
  saveEntities,
  deleteEntity,
  editEntities,
  cargarEntidades
};
