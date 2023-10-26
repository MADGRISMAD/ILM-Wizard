"use strict"
const express = require('express')
const newConfigController = require('../controllers/catalogs.controller')
const routes = express.Router()

routes.post('/getConfigs/', newConfigController.getConfigs);


routes.post ("/getCustomConfigs/:id", newConfigController.getCustomConfigs);
routes.post ("/getCustomConfigs/:id/:parentId", newConfigController.getCustomConfigs);
routes.put ("/setCustomConfigs/:id", newConfigController.setCustomConfigs, newConfigController.getCustomConfigs);
routes.post("/toggleCustomConfig/:id", newConfigController.toggleCustomConfig)

routes.get("/checkCustomField/:id/:field/:value/:objectId", newConfigController.checkCustomField)

module.exports = routes;




