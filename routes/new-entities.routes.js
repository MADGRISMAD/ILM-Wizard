"use strict"
const express = require('express')
const newEntititesController = require('../controllers/new-entities.controller.js')
const routes = express.Router()




routes.get("/obtenerEntidades" , newEntititesController.obtenerEntidades)

routes.get("/getCompanies" , newEntititesController.getCompanies)

routes.get("/obtenerEnvironments" , newEntititesController.obtenerEnvironments)

routes.get("/obtenerInfraestructuras" , newEntititesController.obtenerInfraestructuras)

routes.get("/fetchRegions" , newEntititesController.fetchRegions)

routes.get("/getCompanyById", newEntititesController.getCompanyById);

routes.get("/fetchRegionById", newEntititesController.fetchRegionById);

routes.get("/obtenerEnvironments", newEntititesController.obtenerEnvironments);

routes.get("/obtenerInfraestructuras", newEntititesController.obtenerInfraestructuras);




routes.post("/saveEntities" , newEntititesController.saveEntities)

routes.post("/saveCompanies" , newEntititesController.saveCompanies)

routes.post("/saveRegions", newEntititesController.saveRegions);

routes.post("/guardarEnvironments", newEntititesController.guardarEnvironments);

routes.post("/guardarInfraestructuras", newEntititesController.guardarInfraestructuras);




routes.delete("/deleteEntity", newEntititesController.deleteEntity);

routes.delete("/eliminarCompany/:identifier", newEntititesController.eliminarCompany);

routes.delete("/deleteRegion/:identifier", newEntititesController.deleteRegion);





routes.put("/editEntities", newEntititesController.editEntities);

routes.put("/edit-companies", newEntititesController.editCompanies);
routes.put("/edit-regions", newEntititesController.editRegions);














module.exports = routes;





