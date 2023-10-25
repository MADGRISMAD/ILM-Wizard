const fs = require('fs');
const path = require('path');
const {db} = require("../services/mongodb.service");
// Función para cargar compañías del archivo
async function cargarCompanias(req, res, next) {
  const rawData = await db.collection('_global_companies').find().toArray();
  return rawData[0].companies;
}

// Función para guardar compañías en el archivo
async function guardarCompanias(companies) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_companies.json'), JSON.stringify({ companies }));
}

async function getCompanies(req, res) {
  try{
    const companies = await loadCompanies();
    if(companies)
      res.status(200).json({ code: "OK", object: companies, message: "" });
    else
      res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve companies" });
  }
  catch (err) {
    res.status(505).json({message: "ERROR", error: err });
  }
}

//Eventually will replace cargarCompanias
async function loadCompanies(){
  const rawCompaniesData = await db.collection('_global_companies').find().toArray();
  const CompaniesFirstIndex = 0;
  return rawCompaniesData[CompaniesFirstIndex].companies;
}

async function getCompanyById(req, res) {
  try{ 
    const companyId = req.query._id;
    if(!companyId)
      res.status(400).json({ code: "ERROR", message: "Mandatory query parameter missing (must have _id)" });
    else{
      const mainDocumentId = await loadMainDocumentId();
      const query = 
      {
        _id: mainDocumentId,
        companies: {
          $elemMatch: {
            _id: companyId
          }
        }
      };
  
      const projection = {
        'companies.$': 1 // Include only the matching element in the result
      };
    
      const filteredObject = await db.collection('_global_companies').findOne(query, {projection});
      if (filteredObject) {
        const company = filteredObject.companies[0];
        res.status(200).json({ code: "OK", object: company, message: "Compañia encontrada" });
      } else {
        res.status(404).json({ code: "NOT_FOUND", message: "Compañia no encontrada" });
      }
    }
    
  }
  catch(err){
    res.status(500).json({ code: "ERROR", message: "Company not retrieved", error: err});
  }
}

async function loadMainDocumentId(){
  const rawCompaniesData = await db.collection('_global_companies').find().toArray();
  const CompaniesFirstIndex = 0;
  return rawCompaniesData[CompaniesFirstIndex]._id;
}

async function saveCompanies(req, res) {
  const companies = cargarCompanias();
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);
  companies.push(req.body);
  guardarCompanias(companies);
  res.status(200).json({ code: "OK", object: companies, message: "Compañía agregada con éxito." });
}

async function editCompanies(req, res) {
  const companies = cargarCompanias();
  const matchedCompanyIndex = companies.findIndex(company => company._id === req.body._id);

  if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  companies[matchedCompanyIndex] = req.body;
  guardarCompanias(companies);

  res.status(200).json({ code: "OK", object: companies, message: "Compañía editada con éxito." });
}

async function deleteCompany(req, res) {
  const companies = cargarCompanias();
  const companyIdentifier = req.params._id;
  const matchedCompanyIndex = companies.findIndex(company => company._id === companyIdentifier);

  if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  companies.splice(matchedCompanyIndex, 1);
  guardarCompanias(companies);

  res.status(200).json({ code: "OK", object: companies, message: "Compañía eliminada con éxito." });
}

async function toggleCompanyStatus(req, res) {
  const companies = cargarCompanias();

  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El cuerpo de la petición es inválido." });
  }

  if (!('isEnabled' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
  }

  if (!('_id' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad _id es requerida." });
  }

  const matchedCompanyIndex = companies.findIndex(company => company._id === req.body._id);

  if (matchedCompanyIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  const isEnabled = typeof req.body.isEnabled === 'string' ? req.body.isEnabled.toLowerCase() === "true" : req.body.isEnabled;
  companies[matchedCompanyIndex].isEnabled = isEnabled;
  guardarCompanias(companies);

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
