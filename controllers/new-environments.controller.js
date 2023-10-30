// const fs = require('fs');
// const path = require('path');

// //database client
// const {db} = require("../services/mongodb.service");

// // Para cargar el JSON principal
// function cargarEnvironments() {
//   const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_environments.json'));
//   return JSON.parse(rawData).environments;
// }

// // Para cargar el JSON del catálogo
// function cargarCatalogoEnviroments() {
//   const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_cat_enviroments.json'));
//   return JSON.parse(rawData).environments;
// }

// function guardarEnvironmentsData(environments) {
//   fs.writeFileSync(path.join(__dirname, 'jsons/_global_environments.json'), JSON.stringify({ environments }, null, 4));
// }







// async function obtenerEnvironments(req, res) {
//   try{
//     const environments = await loadEnvironments();
//     if(environments)
//       res.status(200).json({ code: "OK", object: environments, message: "" });
//     else
//       res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve environments" });
//   }
//   catch (err) {
//     res.status(505).json({message: "ERROR", error: err });
//   }
// }

// async function loadEnvironments(){
//   const rawEnvironmentsData = await db.collection('_global_environments').find().toArray();
//   const EnvironmentsFirstIndex = 0;
//   return rawEnvironmentsData[EnvironmentsFirstIndex].environments;
// }

// async function obtenerCatalogoEnviroments(req, res) {
//   try{
//     const environments = await loadEnvironmentsCatalogue();
//     if(environments)
//       res.status(200).json({ code: "OK", object: environments, message: "" });
//     else
//       res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve environments catalogue" });
//   }
//   catch (err) {
//     res.status(505).json({message: "ERROR", error: err });
//   }
// }

// async function loadEnvironmentsCatalogue(){
//   //collection name is bad spelled, should be "environments" not enviroments
//   const rawEnvironmentsData = await db.collection('_global_cat_enviroments').find().toArray();
//   const EnvironmentsFirstIndex = 0;
//   return rawEnvironmentsData[EnvironmentsFirstIndex].environments;
// }

// async function fetchEnvironmentById(req, res) {
//   try{
//     const environmentId = req.query._id;
//     const parentId = req.query.parentId;
//     if(!(environmentId && parentId))
//       res.status(400).json({ code: "ERROR", message: "Mandatory query parameters missing (must have _id && parentId)" });
//     else{
//       const mainDocumentId = await loadMainDocumentId();
//       const query =
//       {
//         _id: mainDocumentId,
//         environments: {
//           $elemMatch: {
//             _id: environmentId,
//             parent_id:parentId
//           }
//         }
//       };

//       const projection = {
//         'environments.$': 1 // Include only the matching element in the result
//       };

//       const filteredObject = await db.collection('_global_environments').findOne(query, {projection});
//       if (filteredObject) {
//         const environment = filteredObject.environments[0];
//         res.status(200).json({ code: "OK", object: environment, message: "Environment encontrado" });
//       } else {
//         res.status(404).json({ code: "NOT_FOUND", message: "Environment no encontrado" });
//       }
//     }

//   }
//   catch(err){
//     res.status(500).json({ code: "ERROR", message: "Environment not retrieved", error: err});
//   }
// }

// async function loadMainDocumentId(){
//   const rawEnvironmentsData = await db.collection('_global_environments').find().toArray();
//   const environmentsFirstIndex = 0;
//   return rawEnvironmentsData[environmentsFirstIndex]._id;
// }

// function guardarEnvironments(req, res) {
//   const environments = cargarEnvironments();
//   environments.push(req.body);
//   guardarEnvironmentsData(environments);
//   res.status(200).json({ code: "OK", object: environments, message: "Entorno agregado con éxito." });
// }

// function toggleEnvironmentsStatus(req, res) {
//   const environments = cargarEnvironments();
//   const envId = req.body._id;
//   const parentId = req.body.parent_id;
//   console.log("Received request with parent_id:", parentId); // Registro para parent_id

//   const isEnabled = req.body.isEnabled === true;

//   const existingEnvironment = environments.find(env => env._id === envId && env.parent_id === parentId);

//   if (!existingEnvironment) {
//       environments.push({
//           _id: envId,
//           parent_id: parentId,  // Guardamos el parent_id
//           isEnabled: isEnabled
//       });
//   } else {
//       existingEnvironment.isEnabled = isEnabled;
//   }

//   guardarEnvironmentsData(environments);
//   res.status(200).json({ code: "OK", object: { _id: envId, isEnabled: isEnabled, parent_id: parentId }, message: "Estado del entorno actualizado con éxito." });
// }
















// module.exports = {
//   obtenerEnvironments,
//   obtenerCatalogoEnviroments,
//   guardarEnvironments,
//   toggleEnvironmentsStatus,
//   fetchEnvironmentById
// };

'use strict';

const { db } = require('../services/mongodb.service');

async function loadEnvironments() {
  const rawEnvironmentsData = await db.collection('_global_environments').find().toArray();
  if (rawEnvironmentsData.length > 0) {
    return rawEnvironmentsData[0].environments;
  } else {
    return []; // O devuelve un valor predeterminado en caso de que no haya datos
  }
}

async function loadEnvironmentsCatalogue() {
  const rawEnvironmentsData = await db.collection('_global_cat_enviroments').find().toArray();
  if (rawEnvironmentsData.length > 0) {
    return rawEnvironmentsData[0].environments;
  } else {
    return []; // O devuelve un valor predeterminado en caso de que no haya datos
  }
}

async function obtenerEnvironments(req, res) {
  try {
    const environments = await loadEnvironments();
    if (environments)
      res.status(200).json({ code: 'OK', object: environments, message: '' });
    else
      res.status(404).json({ code: 'NOT_FOUND', message: "Couldn't retrieve environments" });
  } catch (err) {
    res.status(500).json({ message: 'No se pudieron recuperar las entidades' });
  }
}

async function obtenerCatalogoEnviroments(req, res) {
  try {
    const environments = await loadEnvironmentsCatalogue();
    if (environments)
      res.status(200).json({ code: 'OK', object: environments, message: '' });
    else
      res.status(404).json({ code: 'NOT_FOUND', message: "Couldn't retrieve environments catalogue" });
  } catch (err) {
    res.status(500).json({ message: 'No se pudieron recuperar las entidades del catálogo' });
  }
}

async function fetchEnvironmentById(req, res) {
  try {
    const environmentId = req.query._id;
    const parentId = req.query.parentId;
    if (!(environmentId && parentId))
      res.status(400).json({ code: 'ERROR', message: 'Parámetros de consulta obligatorios ausentes (debe tener _id && parentId)' });
    else {
      const mainDocumentId = await loadMainDocumentId();
      const query = {
        _id: mainDocumentId,
        environments: {
          $elemMatch: {
            _id: environmentId,
            parent_id: parentId
          }
        }
      };

      const projection = {
        'environments.$': 1 // Include only the matching element in the result
      };

      const filteredObject = await db.collection('_global_environments').findOne(query, { projection });
      if (filteredObject) {
        const environment = filteredObject.environments[0];
        res.status(200).json({ code: 'OK', object: environment, message: 'Environment encontrado' });
      } else {
        res.status(404).json({ code: 'NOT_FOUND', message: 'Environment no encontrado' });
      }
    }
  } catch (err) {
    res.status(500).json({ code: 'ERROR', message: 'Environment no recuperado', error: err });
  }
}

async function loadMainDocumentId() {
  const rawEnvironmentsData = await db.collection('_global_environments').find().toArray();
  const environmentsFirstIndex = 0;
  return rawEnvironmentsData[environmentsFirstIndex]._id;
}

async function guardarEnvironmentsData(environments) {
  // Actualiza los datos en MongoDB
  try {
    const mainDocumentId = await loadMainDocumentId();
    const filter = { _id: mainDocumentId };
    const update = { $set: { environments: environments } };
    await db.collection('_global_environments').updateOne(filter, update);
  } catch (error) {
    console.error('Error al guardar los datos del entorno en MongoDB', error);
  }
}

async function guardarEnvironments(req, res) {
  try {
    const environments = await loadEnvironments();
    environments.push(req.body);
    guardarEnvironmentsData(environments);
    res.status(200).json({ code: 'OK', object: environments, message: 'Entorno agregado con éxito.' });
  } catch (error) {
    res.status(500).json({ code: 'ERROR', message: 'No se pudo agregar el entorno', error: error });
  }
}

async function toggleEnvironmentsStatus(req, res) {
  try {
    const environments = await loadEnvironments();
    const envId = req.body._id;
    const parentId = req.body.parent_id;
    console.log('Received request with parent_id:', parentId);

    const isEnabled = req.body.isEnabled === true;

    const existingEnvironment = environments.find(env => env._id === envId && env.parent_id === parentId);

    if (!existingEnvironment) {
      environments.push({
        _id: envId,
        parent_id: parentId,
        isEnabled: isEnabled
      });
    } else {
      existingEnvironment.isEnabled = isEnabled;
    }

    guardarEnvironmentsData(environments);
    res.status(200).json({ code: 'OK', object: { _id: envId, isEnabled: isEnabled, parent_id: parentId }, message: 'Estado del entorno actualizado con éxito.' });
  } catch (error) {
    res.status(500).json({ code: 'ERROR', message: 'No se pudo actualizar el estado del entorno', error: error });
  }
}

module.exports = {
  obtenerEnvironments,
  obtenerCatalogoEnviroments,
  guardarEnvironments,
  toggleEnvironmentsStatus,
  fetchEnvironmentById
};
