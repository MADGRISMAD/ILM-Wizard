"use strict"
const express = require('express')
const newInfraController = require('../controllers/new-infrastructure.controller')
const routes = express.Router()

routes.get("/fetchInfrastructure" , newInfraController.fetchInfrastructure)

module.exports = routes;
