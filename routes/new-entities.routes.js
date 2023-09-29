"use strict"
const express = require('express')
const newEntititesController = require('../controllers/new-entities.controller.js')
const routes = express.Router()




routes.get("/obtenerEntidades" , newEntititesController.obtenerEntidades)

routes.get("/obtenerInfraestructuras" , newEntititesController.obtenerInfraestructuras)

routes.get("/obtenerInfraestructuras", newEntititesController.obtenerInfraestructuras);


routes.post("/saveEntities" , newEntititesController.saveEntities)


routes.post("/guardarInfraestructuras", newEntititesController.guardarInfraestructuras);

routes.delete("/deleteEntity", newEntititesController.deleteEntity);


routes.put("/editEntities", newEntititesController.editEntities);


module.exports = routes;





