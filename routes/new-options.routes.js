"use strict";
const express = require('express');
const newOptionsController = require('../controllers/new-options.controller');
const routes = express.Router();

routes.get("/getDeliveryOptions", newOptionsController.getDeliveryOptions);

routes.get("/getVdcOptions", newOptionsController.getVdcOptions);

module.exports = routes;