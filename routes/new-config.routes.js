"use strict"
const express = require('express')
const newConfigController = require('../controllers/catalogs.controller')
const routes = express.Router()




routes.get("/fetch-catalogs" , newConfigController.fetchCatalogs)




module.exports = routes;




