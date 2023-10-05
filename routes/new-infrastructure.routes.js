"use strict";
const express = require('express');
const newInfraController = require('../controllers/new-infrastructure.controller');
const routes = express.Router();

// Toggle the status of a specific infrastructure
routes.post("/toggleInfrastructureStatus", newInfraController.toggleInfrastructureStatus);

// Fetch a specific infrastructure by its ID
routes.get("/fetchInfrastructureById", newInfraController.fetchInfrastructureById);

// Your existing route
routes.get("/fetchInfrastructure", newInfraController.fetchInfrastructure);





module.exports = routes;
