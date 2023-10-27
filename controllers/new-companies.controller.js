const {db} = require("../services/mongodb.service");

//Call it to get a company by its id, it's useful to check if a company exists
async function getCompanyByIdService(companyId){
  const query = { _id: companyId };
  const  company = await db.collection('_global_companies').findOne(query);
  return company;
}

//Get all companies
async function loadCompanies(){
  const rawCompaniesData = await db.collection('_global_companies').find().toArray();
  return rawCompaniesData;
}

async function getCompanies(req, res) {
  try{
    const companies = await loadCompanies();
    if(companies)
      res.status(200).json({ code: "OK", object: companies, message: "Compañias recuperadas" });
    else
      res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve companies" });
  }
  catch (err) {
    res.status(505).json({message: "ERROR", error: err });
  }
}

async function getCompanyById(req, res) {
  try{
    const companyId = req.params._id;
    const company = await getCompanyByIdService(companyId);
    if (!company) 
      res.status(404).json({ code: "NOT_FOUND", message: "Compañia no encontrada" });
    else
      res.status(200).json({ code: "OK", object: company, message: "Compañia encontrada" });
  }
  catch(err){
    console.log(err);
    res.status(500).json({ code: "ERROR", message: "Compañia no encontrada", error: err});
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
      res.status(400).json({code: "ERROR",message:"Faltan campos obligatorios"});
    }
    else{
      const newCompany = req.body;
      const companyExistsAlready = await getCompanyByIdService(newCompany._id);
      if(companyExistsAlready)
        res.status(409).json({ code: "DUPLICATE", message: "La compañia con ese identificador ya existe" });
      else{
        newCompany._id = newCompany._id.toString();
        newCompany.isEnabled = typeof newCompany.isEnabled === 'string' ? newCompany.isEnabled.toLowerCase() === "true" : newCompany.isEnabled;
        const result = await db.collection("_global_companies").insertOne(newCompany);
        const companies = await loadCompanies();
        res.status(200).json({ code: "OK", object: companies, message: "Compañía agregada con éxito." })
      }
    }
  } catch (error) {
    res.status(505).json({code: "ERROR", message:"Could not post company", error: error});
  }
}

async function deleteCompany(req, res) {
  try {
    const companyToDelete = req.params._id;
    const deleteCondition = {_id: companyToDelete};
    const CompanyExists = await getCompanyByIdService(companyToDelete);
    if(!CompanyExists)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
    else{
      const result = await db.collection("_global_companies").deleteOne(deleteCondition);
      const companies = await loadCompanies();
      res.status(200).json({ code: "OK", object: companies, message: "Compañía eliminada con éxito." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({message:"Could not delete company", error: error});
  }
}

async function editCompanies(req, res) {
  try {
    const companyIdToUpdate = req.params._id;
    const companyExists = await getCompanyByIdService(companyIdToUpdate);
    if(!companyExists)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });       
    else{
     
      const filter = {_id: companyIdToUpdate};

      //Converting isEnabled to boolean if it's a string
      if (typeof req.body.isEnabled === 'string')
        req.body.isEnabled = (req.body.isEnabled.toLowerCase() === "true" || req.body.isEnabled === true);
      
      //Creating the object for updating
      let setObject = req.body;
  
      //Deleting the _id property from the object, since it should not be updated
      if(setObject.hasOwnProperty("_id"))
        delete setObject["_id"];
  
      const updateOperation = {
        $set: setObject
      };
  
      const result = await db.collection("_global_companies").updateOne(filter, updateOperation);
      const companies = await loadCompanies();
      res.status(200).json({ code: "OK", object: companies, message: "Compañía editada con éxito." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({code: "NOT_FOUND", message:"Could not delete company", error: error});
  }
}

async function toggleCompanyStatus(req, res) {
  try {
    companyId = req.params._id;
    const companyIdExists = await getCompanyByIdService(companyId);
    if(!companyIdExists)
      res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
    else{
      const body = req.body;
      if (!('isEnabled' in body)) 
        res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
      else{
        //is Enabled could be a string, so me convert it to boolean in that case
        const isEnabled = typeof body.isEnabled === 'string' ? body.isEnabled.toLowerCase() === "true" : body.isEnabled
        const filter = {_id: companyId};
        const updateOperation = {
          $set: {
            "isEnabled": isEnabled
          }
        };
        const result = await db.collection("_global_companies").updateOne(filter, updateOperation);
        const companyUpdated = await getCompanyByIdService(companyId);
        res.status(200).json({ code: "OK", object: companyUpdated, message: "Estado de la compañía actualizado con éxito." });
      }   
    }

  } catch (error) {
    res.status(500).json({ code: "NOT_FOUND", message: "Hubo un error inesperado." });
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
