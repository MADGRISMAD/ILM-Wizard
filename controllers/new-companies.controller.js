const companies = [
  {

    "identifier": "imx",
    "Company": "MX",
    "entity_id": "MX",
    "Hostname_prefix": "mxr",
    "Region_or_client_code": "Region 1",
    "Delivery": "Delivery 1",
    "VDC": "VDC 1",
    "CMDB_company": "CMDB Company 1",
    "isEnabled": true,
    "select": "di",
    "short_name": "BSMX",
    "nicName": "nic",
    "region": "mx"
  },
  {
    "identifier": "us",
    "Company": "US",
    "entity_id": "US",
    "Hostname_prefix": "mxr",
    "Region_or_client_code": "Region 1",
    "Delivery": "Delivery 1",
    "VDC": "VDC 1",
    "CMDB_company": "CMDB Company 1",
    "isEnabled": true,
    "select": "di",
    "short_name": "BSMX",
    "nicName": "nic",
    "region": "mx"
  },
  // ... otras compañías
];





function getCompanies(req, res) {

  res.status(200).json({code: "OK", object: companies, message: ""});

}





function getCompanyById(req, res) {
const companyId = req.query.identifier; // Asume que el identificador se envía como un parámetro de consulta

// Busca la compañía por su identificador
const company = companies.find(c => c.identifier === companyId);

if (company) {
    // Si se encuentra la compañía, devuelve un estado 200 y la compañía
    res.status(200).json({ code: "OK", object: company, message: "" });
} else {
    // Si no se encuentra, devuelve un estado 404 y un mensaje de error
    res.status(404).json({ code: "NOT_FOUND", message: "Compañía no encontrada" });
}
}



function saveCompanies(req, res) {
  // Convertir isEnabled a booleano (por si acaso)
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

  // Si la compañía no existe, la añade (no hacemos la verificación de unicidad ahora)
  companies.push(req.body);
  res.status(200).json({code: "OK", object: companies, message: "Compañía agregada con éxito."});
}




function editCompanies(req, res) {

// Obtener el índice de la compañía a editar con matchedCompany
const matchedCompanyIndex = companies.findIndex(company => company.identifier === req.body.identifier);

// Si no existe la compañía
if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
}

// Convertir la propiedad isEnabled a booleano si es un string
if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
}

// Si existe la compañía
companies[matchedCompanyIndex] = req.body;
res.status(200).json({ code: "OK", object: companies, message: "Compañía editada con éxito." });
}



function deleteCompany(req, res) {

// Obtener el identificador de la compañía desde el parámetro de ruta
const companyIdentifier = req.params.identifier;

// Obtener el índice de la compañía a eliminar usando el identificador
const matchedCompanyIndex = companies.findIndex(company => company.identifier === companyIdentifier);

// Si no existe la compañía
if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
}

// Si existe la compañía, la elimina
companies.splice(matchedCompanyIndex, 1);
res.status(200).json({ code: "OK", object: companies, message: "Compañía eliminada con éxito." });
}

function toggleCompanyStatus(req, res) {
  // Validar que req.body es un objeto y no es nulo
  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El cuerpo de la petición es inválido." });
  }

  // Validar que la propiedad 'isEnabled' está presente
  if (!('isEnabled' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
  }

  // Validar que la propiedad 'identifier' está presente
  if (!('identifier' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad identifier es requerida." });
  }

  const matchedCompanyIndex = companies.findIndex(company => company.identifier === req.body.identifier);

  // Si no existe la compañía
  if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  // Convertir la propiedad isEnabled a booleano si es un string
  const isEnabled = typeof req.body.isEnabled === 'string' ? req.body.isEnabled.toLowerCase() === "true" : req.body.isEnabled;

  // Si existe la compañía, actualizar solo el campo isEnabled
  companies[matchedCompanyIndex].isEnabled = isEnabled;

  res.status(200).json({ code: "OK", object: companies[matchedCompanyIndex], message: "Estado de la compañía actualizado con éxito." });
}

module.exports = {
  getCompanies,
  getCompanyById,
  saveCompanies,
  editCompanies,
  deleteCompany,
  toggleCompanyStatus
};

