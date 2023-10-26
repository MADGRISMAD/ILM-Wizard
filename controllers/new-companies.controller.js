const fs = require('fs');
const path = require('path');
const {db} = require("../services/mongodb.service");
const { Console } = require('console');
// Función para cargar compañías del archivo
async function cargarCompanias(req, res, next) {
  const rawData = await db.collection('_global_companies').find().toArray();
  return rawData[0].companies;
}

// Función para guardar compañías en el archivo
async function guardarCompanias(companies) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_companies.json'), JSON.stringify({ companies }));
}

async function loadMainDocumentId(){
  const rawCompaniesData = await db.collection('_global_companies').find().toArray();
  const CompaniesFirstIndex = 0;
  return rawCompaniesData[CompaniesFirstIndex]._id;
}

async function companyExists(companyId, mainDocumentId)
{
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
  return filteredObject;
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
      const filteredObject = await companyExists(companyId, mainDocumentId);
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

async function bodyValid(body){
  const requiredFields = [
    "parent_id",
    "entity_id",
    "_id",
    "Company",
    "Hostname_prefix",
    "Region_or_client_code",
    "Delivery",
    "VDC",
    "CMDB_company",
    "isEnabled",
    "short_name",
    "nicName",
    "region"
  ];
  const missingFields = requiredFields.filter(field => !(field in body));
  return missingFields.length > 0;
}

async function saveCompanies(req, res) {  
  try {
    if (await bodyValid(req.body)) {
      res.status(400).json({message:"Bad request, body is missing required fields"});
    }
    else{
      const mainDocumentId = await loadMainDocumentId();
      const newCompany = req.body;
      newCompany._id = newCompany._id.toString(); 
      const filter = {_id: mainDocumentId};
      const postOperation = {
        $push: {
          companies: newCompany
        }
      };
      const result = await db.collection("_global_companies").updateOne(filter, postOperation);
      res.status(200).json({message: "Company inserted", company: req.body});
    }    
  } catch (error) {
    console.log(error);
    res.status(505).json({message:"Could not post company", error: error});
  }
}

async function deleteCompany(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const filter = {_id: mainDocumentId};
    const elementIdToDelete = req.params._id;

    if(!elementIdToDelete)
      res.status(400).json({ code: "ERROR", message: "Mandatory query parameter missing (must have _id)" });
    else
    {
      const deleteOperation = {
        $pull: {
          companies: {_id: elementIdToDelete}
        }
      };
  
      const documentExists = await companyExists(elementIdToDelete, mainDocumentId);
      if(documentExists)
      {
        const result = await db.collection("_global_companies").updateOne(filter, deleteOperation);
        res.status(200).json({message: "Company deleted"});
      }
      else
        res.status(404).json({message: "Company doesn't exist"});  
    }
  } catch (error) {
    res.status(505).json({message:"Could not delete company", error: error});    
  }
}
  


async function editCompanies(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const elementIdToUpdate = req.params._id;
    if(!elementIdToUpdate)
      res.status(400).json({ code: "NOT_FOUND", message: "Mandatory query parameter missing (must have _id)" });
    else
    {
      const filter = {_id: mainDocumentId, "companies._id": elementIdToUpdate};
      //Creating the $set object
      if (typeof req.body.isEnabled === 'string')
        req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";

      let setObject = {};
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          const value = req.body[key];
          console.log(key, value);
          setObject[`companies.$.${key}`] = value;
        }
      }

      //Deleting the _id property from the object, since it should not be updated
      if(setObject.hasOwnProperty("companies.$._id"))
        delete setObject["companies.$._id"];

      const updateOperation = {
        $set: setObject
      };
      
      const documentExists = await companyExists(elementIdToUpdate, mainDocumentId);
      if(documentExists)
      {
        const result = await db.collection("_global_companies").updateOne(filter, updateOperation);
        const companies = await loadCompanies();
        res.status(200).json({ code: "OK", object: companies, message: "Compañía editada con éxito." });
      }
      else
        res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." }); 
    }
  } catch (error) {
    console.log(error);
    res.status(505).json({code: "NOT_FOUND", message:"Could not delete company", error: error});    
  }

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
