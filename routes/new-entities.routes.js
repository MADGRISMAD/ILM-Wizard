"use strict"
const express = require('express')
const newEntititesController = require('../controllers/new-entities.controller.js')
const routes = express.Router()




routes.get("/obtenerEntidades" , newEntititesController.obtenerEntidades)

routes.get("/obtenerCompanies" , newEntititesController.obtenerCompanies)

routes.get("/obtenerEnvironments" , newEntititesController.obtenerEnvironments)

routes.get("/obtenerInfraestructuras" , newEntititesController.obtenerInfraestructuras)

routes.get("/obtenerRegions" , newEntititesController.obtenerRegions)

routes.get("/obtenerCompanyPorId", newEntititesController.obtenerCompanyPorId);

routes.get("/obtenerRegionPorId", newEntititesController.obtenerRegionPorId);

routes.get("/obtenerEnvironments", newEntititesController.obtenerEnvironments);

routes.get("/obtenerInfraestructuras", newEntititesController.obtenerInfraestructuras);




routes.post("/guardarEntidades" , newEntititesController.guardarEntidades)

routes.post("/guardarCompanies" , newEntititesController.guardarCompanies)

routes.post("/guardarRegions", newEntititesController.guardarRegions);

routes.post("/guardarEnvironments", newEntititesController.guardarEnvironments);

routes.post("/guardarInfraestructuras", newEntititesController.guardarInfraestructuras);




routes.delete("/eliminarEntidad", newEntititesController.eliminarEntidad);

routes.delete("/eliminarCompany/:identifier", newEntititesController.eliminarCompany);

routes.delete("/eliminarRegion/:identifier", newEntititesController.eliminarRegion);





routes.put("/editarEntidades", newEntititesController.editarEntidades);

routes.put("/editar-companies", newEntititesController.editarCompanies);
routes.put("/editar-regions", newEntititesController.editarRegions);














module.exports = routes;





