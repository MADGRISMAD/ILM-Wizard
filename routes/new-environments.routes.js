"use strict"
const express = require('express')
const newenvironmentsController = require('../controllers/new-environments.controller');
const routes = express.Router()

routes.get("/obtenerEnvironments" , newenvironmentsController.obtenerEnvironments)
routes.post("/guardarEnvironments", newenvironmentsController.guardarEnvironments);

module.exports = routes;
