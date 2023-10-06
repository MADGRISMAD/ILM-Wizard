"use strict";
const express = require('express');
const newInfraController = require('../controllers/new-infrastructure.controller');
const routes = express.Router();

// Toggle the status of a specific infrastructure
routes.post("/toggleInfrastructureStatus", newInfraController.toggleInfrastructureStatus);

// Fetch a specific infrastructure by its ID
routes.get("/fetchInfrastructureById", newInfraController.fetchInfrastructureById);

// Fetch a list of all infrastructures
routes.get("/fetchInfrastructure", newInfraController.obtenerInfraestructuras);

// Nuevas rutas para infraestructuras:

// Crear una nueva infraestructura
routes.post("/createInfrastructure", newInfraController.guardarInfraestructura);

// Actualizar una infraestructura existente
routes.put("/updateInfrastructure/:id", newInfraController.guardarInfraestructura);

// Eliminar una infraestructura
routes.delete("/deleteInfrastructure/:id", newInfraController.guardarInfraestructura);

// Obtener todas las infraestructuras
routes.get("/obtenerInfraestructuras", newInfraController.obtenerInfraestructuras);

// Obtener el catálogo de infraestructuras
routes.get("/obtenerCatalogoInfraestructuras", newInfraController.obtenerCatalogoInfraestructuras);

module.exports = routes;
