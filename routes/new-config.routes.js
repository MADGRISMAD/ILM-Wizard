"use strict"
const express = require('express')
const newConfigController = require('../controllers/catalogs.controller')
const routes = express.Router()

routes.get('/getConfigs', newConfigController.getConfigs);








module.exports = routes;




