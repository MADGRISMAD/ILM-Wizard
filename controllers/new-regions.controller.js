const regions = [
  {
    "entity_id": "MX",
    "identifier": "Region 1",
    "Region": "Region 1",
    "isEnabled": true
  },
  {
    "entity_id": "US",
    "identifier": "Region 2",
    "Region": "Region 2",
    "isEnabled": true
  },
  {
    "entity_id": "MX",
    "identifier": "Region 3",
    "Region": "Region 3",
    "isEnabled": true
  },
  {
    "entity_id": "US",
    "identifier": "Region 4",
    "Region": "Region 4",
    "isEnabled": true
  },
  // ... otras regiones
];

function fetchRegions(req, res) {
  const entityId = req.query.entity_id; // Obteniendo entity_id desde la consulta

  if (!entityId) {
      return res.status(400).json({code: "ERROR", message: "Falta el parámetro entity_id."});
  }

  const filteredRegions = regions.filter(region => region.entity_id === entityId);

  res.status(200).json({code: "OK", object: filteredRegions, message: ""});
}

function fetchRegionById(req, res) {
  const regionId = req.query.identifier; // Asume que el identificador se envía como un parámetro de consulta

  // Busca la región por su identificador
  const region = regions.find(r => r.identifier === regionId);

  if (region) {
      // Si se encuentra la región, devuelve un estado 200 y la región
      res.status(200).json({ code: "OK", object: region, message: "" });
  } else {
      // Si no se encuentra, devuelve un estado 404 y un mensaje de error
      res.status(404).json({ code: "NOT_FOUND", message: "Región no encontrada" });
  }
}

function saveRegions(req, res) {

  // Verificar si ya existe una región con el mismo identificador
  const regionExistente = regions.find(region =>
      region.identifier && region.identifier.toLowerCase() === req.body.identifier.toLowerCase()
  );

  // Si la región ya existe
  if (regionExistente) {
      return res.status(409).json({code: "DUPLICATE", message: "La región con ese identificador ya existe."});
  }

  // Convertir isEnabled a booleano (por si acaso)
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

  // Si la región no existe, la añade
  regions.push(req.body);
  res.status(200).json({code: "OK", object: regions, message: "Región agregada con éxito."});
}

function editRegions(req, res) {

  const matchedRegionIndex = regions.findIndex(region => region.identifier === req.body.identifier);

  // Si no existe la región
  if (matchedRegionIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  // Convertir la propiedad isEnabled a booleano si es un string
  if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  // Si existe la región
  regions[matchedRegionIndex] = req.body;
  res.status(200).json({ code: "OK", object: regions, message: "Región editada con éxito." });
}

function deleteRegion(req, res) {

  // Obtener el identificador de la región desde el parámetro de ruta
  const regionIdentifier = req.params.identifier;

  // Obtener el índice de la región a eliminar usando el identificador
  const matchedRegionIndex = regions.findIndex(region => region.identifier === regionIdentifier);

  // Si no existe la región
  if (matchedRegionIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  // Si existe la región, la elimina
  regions.splice(matchedRegionIndex, 1);
  res.status(200).json({ code: "OK", object: regions, message: "Región eliminada con éxito." });
}


module.exports = {
  fetchRegions,
  fetchRegionById,
  saveRegions,
  editRegions,
  deleteRegion
};

