"use strict"
const express = require('express')
const newCompaniesController = require('../controllers/new-companies.controller');
const routes = express.Router()

routes.get("/getCompanies" , newCompaniesController.getCompanies)

routes.get("/getCompanyById/:_id", newCompaniesController.getCompanyById);

routes.post("/saveCompanies" , newCompaniesController.saveCompanies)

routes.put("/editCompany/:_id", newCompaniesController.editCompanies);

routes.post("/toggleStatus/:_id", newCompaniesController.toggleCompanyStatus);

routes.delete("/deleteCompany/:_id", newCompaniesController.deleteCompany);



module.exports = routes;
