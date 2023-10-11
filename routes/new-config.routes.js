"use strict"
const express = require('express')
const newConfigController = require('../controllers/catalogs.controller')
const routes = express.Router()

routes.get('/getConfigs/vmware', newConfigController.getConfigsVMWare);

routes.get('/getConfigs/ohe', newConfigController.getConfigsOHE);






module.exports = routes;




