"use strict"
const express = require('express')
const newConfigController = require('../controllers/catalogs.controller')
const routes = express.Router()

routes.post('/getConfigs/vmware', newConfigController.getConfigsVMWare);

routes.post('/getConfigs/ohe', newConfigController.getConfigsOHE);


routes.post ("/getCustomConfigs/:id", newConfigController.getCustomConfigs);
routes.put ("/setCustomConfigs/:id", newConfigController.setCustomConfigs);
routes.post("/toggleCustomConfig/:id", newConfigController.toggleCustomConfig)

module.exports = routes;




