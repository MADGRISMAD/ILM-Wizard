"use strict"
const express = require('express')
const newEntititesController = require('../controllers/new-entities.controller.js')
const routes = express.Router()




routes.get("/obtenerEntidades" , newEntititesController.obtenerEntidades)

routes.get("/obtenerCompanies" , newEntititesController.obtenerCompanies)

routes.get("/obtenerEnvironments" , newEntititesController.obtenerEnvironments)

routes.get("/obtenerInfraestructuras" , newEntititesController.obtenerInfraestructuras)

routes.get("/obtenerRegions" , newEntititesController.obtenerRegions)

routes.post("/guardarEntidades" , newEntititesController.guardarEntidades)

routes.post("/guardarCompanies" , newEntititesController.guardarCompanies)

routes.post("/guardarEnvironments", newEntititesController.guardarEnvironments);

routes.post("/guardarInfraestructuras", newEntititesController.guardarInfraestructuras);




routes.delete("/eliminarUltimaEntidad", newEntititesController.eliminarUltimaEntidad);

routes.get("/obtenerEnvironments", newEntititesController.obtenerEnvironments);

routes.get("/obtenerInfraestructuras", newEntititesController.obtenerInfraestructuras);

routes.put("/editarEntidades", newEntititesController.editarEntidades);











module.exports = routes;





