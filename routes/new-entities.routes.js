"use strict"
const express = require('express')
const newEntititesController = require('../controllers/new-entities.controller.js')
const routes = express.Router()




routes.get("/obtenerEntidades" , newEntititesController.obtenerEntidades)

routes.post("/guardarEntidades" , newEntititesController.guardarEntidades)

routes.delete("/eliminarUltimaEntidad", newEntititesController.eliminarUltimaEntidad);

routes.get("/obtenerCompanies" , newEntititesController.obtenerCompanies)





module.exports = routes;





