'use strict';

const express = require('express');
const newEntititesController = require('../controllers/new-entities.controller.js');
const routes = express.Router();

routes.get('/obtenerEntidades', newEntititesController.obtenerEntidades);

routes.post('/saveEntities', newEntititesController.saveEntities);

routes.delete('/deleteEntity/:_id', newEntititesController.deleteEntity);

routes.put('/editEntities/:_id', newEntititesController.editEntities);

module.exports = routes;
