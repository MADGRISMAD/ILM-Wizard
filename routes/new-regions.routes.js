"use strict"
const express = require('express')
const newRegionsController = require('../controllers/new-regions.controller')
const routes = express.Router()

routes.get("/fetchRegions" , newRegionsController.fetchRegions)

routes.get("/fetchRegionById/:_id", newRegionsController.fetchRegionById);

routes.post("/saveRegions", newRegionsController.saveRegions);

routes.delete("/deleteRegion/:_id", newRegionsController.deleteRegion);

routes.put("/edit-regions/:_id", newRegionsController.editRegions);

routes.post("/toggleStatus/:_id", newRegionsController.toggleRegionStatus);

module.exports = routes;
