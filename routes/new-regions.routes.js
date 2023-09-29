"use strict"
const express = require('express')
const newRegionsController = require('../controllers/new-regions.controller')
const routes = express.Router()

routes.get("/fetchRegions" , newRegionsController.fetchRegions)

routes.get("/fetchRegionById", newRegionsController.fetchRegionById);

routes.post("/saveRegions", newRegionsController.saveRegions);

routes.delete("/deleteRegion/:identifier", newRegionsController.deleteRegion);

routes.put("/edit-regions", newRegionsController.editRegions);

routes.post("/toggleStatus", newRegionsController.toggleRegionStatus);

module.exports = routes;
