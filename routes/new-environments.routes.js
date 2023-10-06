"use strict";
const express = require('express');
const newenvironmentsController = require('../controllers/new-environments.controller');
const routes = express.Router();

// Ruta existente para obtener los "environments"
routes.get("/obtenerEnvironments", newenvironmentsController.obtenerEnvironments);

// Ruta nueva para obtener los "environments" del catálogo
routes.get("/obtenerCatalogoEnviroments", newenvironmentsController.obtenerCatalogoEnviroments);

// Ruta existente para guardar los "environments"
routes.post("/guardarEnvironments", newenvironmentsController.guardarEnvironments);

// Ruta existente para cambiar el estado de los "environments"
routes.post("/toggleEnvironmentsStatus", newenvironmentsController.toggleEnvironmentsStatus);


// Ruta existente para obtener un "environment" específico por ID
routes.get("/fetchEnvironmentById", newenvironmentsController.fetchEnvironmentById);

module.exports = routes;
