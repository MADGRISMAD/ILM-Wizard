const fs = require('fs');
const path = require('path');
const {db} = require("../services/mongodb.service");

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
      res.status(400).json({code: "ERROR",message:"Bad request, body is missing required fields"});
    }
    else{
      const mainDocumentId = await loadMainDocumentId();
      const newCompany = req.body;
      newCompany._id = newCompany._id.toString();
      newCompany.isEnabled = (newCompany.isEnabled.toLowerCase() === 'true' || newCompany.isEnabled === true);
      const filter = {_id: mainDocumentId};
      const postOperation = {
        $push: {
          companies: newCompany
        }
      };
      const result = await db.collection("_global_companies").updateOne(filter, postOperation);
      const companies = await loadCompanies();
      res.status(200).json({ code: "OK", object: companies, message: "Compañía agregada con éxito." })
    }
  } catch (error) {
    res.status(505).json({code: "ERROR", message:"Could not post company", error: error});
  }
}

async function deleteCompany(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const filter = {_id: mainDocumentId};
    const elementIdToDelete = req.params._id;

    if(!elementIdToDelete)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
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
        const companies = await loadCompanies();
        res.status(200).json({ code: "OK", object: companies, message: "Compañía eliminada con éxito." });
      }
      else
        res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
    }
  } catch (error) {
    res.status(500).json({message:"Could not delete company", error: error});
  }
}

async function editCompanies(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const elementIdToUpdate = req.params._id;
    if(!elementIdToUpdate)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." })
    else
    {
      const filter = {_id: mainDocumentId, "companies._id": elementIdToUpdate};
      //Creating the $set object
      if (typeof req.body.isEnabled === 'string')
        req.body.isEnabled = (req.body.isEnabled.toLowerCase() === "true" || req.body.isEnabled === true);
      let setObject = {};
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          const value = req.body[key];
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
    res.status(500).json({code: "NOT_FOUND", message:"Could not delete company", error: error});
  }

}

async function toggleCompanyStatus(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    companieId = req.params._id;
    const documentExists = await companyExists(companieId, mainDocumentId);
    if(!documentExists)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
    else{
      const body = req.body;
      if (!('isEnabled' in body)) 
        res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
      else{
        //is Enabled could be a string, so me convert it to boolean in that case
        const isEnabled = typeof body.isEnabled === 'string' ? body.isEnabled.toLowerCase() === "true" : body.isEnabled
        const filter = {_id: mainDocumentId, "companies._id": companieId};
        const updateOperation = {
          $set: {
            "companies.$.isEnabled": isEnabled
          }
        };
        const result = await db.collection("_global_companies").updateOne(filter, updateOperation);
        const filteredObject = await companyExists(companieId, mainDocumentId);
        const company = filteredObject.companies[0];
        if(result.modifiedCount === 0)
          res.status(404).json({ code: "NOT_FOUND", message: "Hubo un error inesperado." });
        else
          res.status(200).json({ code: "OK", object: company, message: "Estado de la compañía actualizado con éxito." });
      }
      
    }

  } catch (error) {
    res.status(404).json({ code: "NOT_FOUND", message: "Hubo un error inesperado." });
  }
 
}

module.exports = {
  getCompanies,
  getCompanyById,
  saveCompanies,
  editCompanies,
  deleteCompany,
  toggleCompanyStatus
};
