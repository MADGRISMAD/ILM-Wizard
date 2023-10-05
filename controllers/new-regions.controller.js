const fs = require('fs');
const path = require('path');

// Función para cargar regiones del archivo
function cargarRegiones() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_regions.json'));
  return JSON.parse(rawData).regions;
}

// Función para guardar regiones en el archivo
function guardarRegiones(regions) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_regions.json'), JSON.stringify({ regions }));
}

function fetchRegions(req, res) {
  const regions = cargarRegiones();
  const entityId = req.query.entity_id;

  if (!entityId) {
    return res.status(400).json({ code: "ERROR", message: "Falta el parámetro entity_id." });
  }

  const filteredRegions = regions.filter(region => region.entity_id === entityId);
  res.status(200).json({ code: "OK", object: filteredRegions, message: "" });
}

function fetchRegionById(req, res) {
  const regions = cargarRegiones();
  const regionId = req.query.identifier;

  const region = regions.find(r => r.identifier === regionId);
  if (region) {
    res.status(200).json({ code: "OK", object: region, message: "" });
  } else {
    res.status(404).json({ code: "NOT_FOUND", message: "Región no encontrada" });
  }
}

function saveRegions(req, res) {
  const regions = cargarRegiones();

  const regionExistente = regions.find(region =>
    region.identifier && region.identifier.toLowerCase() === req.body.identifier.toLowerCase()
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
  const matchedRegionIndex = regions.findIndex(region => region.identifier === req.body.identifier);
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
  const regionIdentifier = req.params.identifier;
  const matchedRegionIndex = regions.findIndex(region => region.identifier === regionIdentifier);
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

  if (!('identifier' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad identifier es requerida." });
  }

  const matchedRegionIndex = regions.findIndex(region => region.identifier === req.body.identifier);

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

