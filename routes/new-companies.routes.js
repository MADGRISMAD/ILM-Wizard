"use strict"
const express = require('express')
const newCompaniesController = require('../controllers/new-companies.controller');
const routes = express.Router()

routes.get("/getCompanies" , newCompaniesController.getCompanies)

routes.get("/getCompanyById", newCompaniesController.getCompanyById);

routes.post("/saveCompanies" , newCompaniesController.saveCompanies)

routes.put("/edit-companies", newCompaniesController.editCompanies);

routes.post("/toggleStatus", newCompaniesController.toggleCompanyStatus);

routes.delete("/deleteCompany/:_id", newCompaniesController.deleteCompany);



module.exports = routes;
