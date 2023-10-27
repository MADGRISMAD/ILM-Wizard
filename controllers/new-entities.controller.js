'use strict'
//database client
const {db} = require("../services/mongodb.service");

async function loadMainDocumentId(){
  const rawEntitiesData = await db.collection('_global_entities').find().toArray();
  const EntitiesFirstIndex = 0;
  return rawEntitiesData[EntitiesFirstIndex]._id;
}

async function entityExists(entityId, mainDocumentId) {
  const query =
  {
    _id: mainDocumentId,
    entidades: {
      $elemMatch: {
        _id: entityId
      }
    }
  };

  const projection = {
    'entidades.$': 1 // Include only the matching element in the result
  };

  const filteredObject = await db.collection('_global_entities').findOne(query, {projection});
  return filteredObject;
}

async function bodyValid(body){
  const requiredFields = [
    "_id",
    "companyName",
    "description",
    "isEnabled",
    "flag"
  ];
  const missingFields = requiredFields.filter(field => !(field in body));
  const result = missingFields.length > 0;
  return result;
}

async function loadEntities() {
  const rawEntitysData = await db.collection('_global_entities').find().toArray();
  if (rawEntitysData.length > 0) {
    return rawEntitysData[0].entidades;
  } else {
    return []; // O devuelve un valor predeterminado en caso de que no haya datos
  }
}

async function obtenerEntidades(req, res) {
  try{
    const entidades = await loadEntities();
    if(entidades)
      res.status(200).json({ code: "OK", object: entidades, message: "" });
    else
      res.status(404).json({ code: "NOT_FOUND", message: "No se pudieron cargar las entidades" });
  }
  catch(err){
    res.status(500).json({message:"No se pudieron cargar las entidades"})
  }
}

async function saveEntities(req, res) {
  try {
    if (await bodyValid(req.body))
      res.status(400).json({code: "ERROR",message:"Faltan campos obligatorios"});
    else{
      const entityId = req.body._id;
      const mainDocumentId = await loadMainDocumentId();
      const entidadExistente = await entityExists(entityId, mainDocumentId); // Verifica si la entidad ya existe

      if (entidadExistente)
        res.status(409).json({ code: "DUPLICATE", message: "La entidad con ese identificador ya existe." });
      else{
        const newEntity = req.body;
        if(typeof newEntity._id !== 'string')
          newEntity._id = newEntity._id.toString();

        newEntity.isEnabled = typeof newEntity.isEnabled === 'string' ? newEntity.isEnabled.toLowerCase() === "true" : newEntity.isEnabled;
        const filter = {_id: mainDocumentId};
        const postOperation = {
          $push: {
            entidades: newEntity
          }
        };
        const result = await db.collection("_global_entities").updateOne(filter, postOperation);
        if(result.modifiedCount === 0)
          res.status(500).json({ code: "ERROR",message: "Error inesperado, Entidad no se pudo agregar." })  ;
        else{
          const entidades = await loadEntities();
          res.status(200).json({ code: "OK", object: entidades, message: "Entidad agregada con éxito." })
        }
      }    
    }

  } catch (error) {
    res.status(500).json({ code: "ERROR", message: "No se pudo agregar la entidad", error: error });
  }
}

async function editEntities(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const entityId = req.body._id;
    const entidadExistente = await entityExists(entityId, mainDocumentId);
    if(!entidadExistente)
      return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
    else{
      const filter = {_id: mainDocumentId, "entidades._id": entityId};
      //Creating the $set object
      if (typeof req.body.isEnabled === 'string')
        req.body.isEnabled = (req.body.isEnabled.toLowerCase() === "true" || req.body.isEnabled === true);
      let setObject = {};
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key)) {
          const value = req.body[key];
          setObject[`entidades.$.${key}`] = value;
        }
      }

      //Deleting the _id property from the object, since it should not be updated
      if(setObject.hasOwnProperty("entidades.$._id"))
        delete setObject["entidades.$._id"];

      const updateOperation = {
        $set: setObject
      };

      const result = await db.collection("_global_entities").updateOne(filter, updateOperation);
      if(result.modifiedCount === 0)
        res.status(500).json({ code: "ERROR", message: "No se pudo editar la entidad", error: error });
      else{
        const entidades = await loadEntities();
        res.status(200).json({ code: "OK", object: entidades, message: "Entidad editada con éxito." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "ERROR", message: "No se pudo editar la entidad", error: error });
  }
}

async function deleteEntity(req, res) {
  try {
    const mainDocumentId = await loadMainDocumentId();
    const entityId = req.params._id;
    const filter = {_id: mainDocumentId};
    const deleteOperation = {
      $pull: {
        entidades: {_id: entityId}
      }
    };

    const documentExists = await entityExists(entityId, mainDocumentId);
    if(!documentExists)
      return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
    else{
      const result = await db.collection("_global_entities").updateOne(filter, deleteOperation);
      if(result.modifiedCount === 0)
        res.status(500).json({ code: "ERROR", message: "No se pudo eliminar la entidad", error: error });
      else{
        const entidades = await loadEntities();
        res.status(200).json({ code: "OK", object: entidades, message: "Entidad eliminada con éxito." });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ code: "ERROR", message: "No se pudo eliminar la entidad", error: error });
  }
}


module.exports = {
  obtenerEntidades,
  saveEntities,
  deleteEntity,
  editEntities,
  loadEntities,
  entityExists
};


// 'use strict'

// const fs = require('fs');
// const path = require('path');

// //database client
// const {db} = require("../services/mongodb.service");

// // Función para cargar entidades del archivo
// async function cargarEntidades() {
//   const rawData = await db.collection('_global_entities').find().toArray();
//   return rawData[0].entidades;
// }


// async function entityExists(entityId) {
//   const filter = { _id: entityId }; // Filtra por el identificador único de la entidad
//   const result = await db.collection('_global_entities').findOne(filter);

//   return result !== null; // Si result es null, la entidad no existe; de lo contrario, existe.
// }

// // function to load entities from mongoDB (eventually will replace cargarEntidades)
// async function loadEntities() {
//   const rawEntitysData = await db.collection('_global_entities').find().toArray();
//   if (rawEntitysData.length > 0) {
//     return rawEntitysData[0].entidades;
//   } else {
//     return []; // O devuelve un valor predeterminado en caso de que no haya datos
//   }
// }


// async function obtenerEntidades(req, res) {
//   try{
//     const entidades = await loadEntities();
//     if(entidades)
//       res.status(200).json({ code: "OK", object: entidades, message: "" });
//     else
//       res.status(404).json({ code: "NOT_FOUND", message: "Couldn't retrieve entities" });
//   }
//   catch(err){
//     res.status(500).json({message:"Couldn't retrieve entities"})
//   }

//   // mongoService.connectToServer(function(err) {
//   //   if(err) {
//   //     console.log(err);
//   //   } else {
//   //     const db = mongoService.getDb();

//   //     db.collection('_global_entities').find({});
//   //   }
//   // })
//   // mongoConfig.connectToServer( function( connectionError, client ) {
//   //       if (connectionError) {
//   //           res.status(500).send({code: "KO", object: null, error: connectionError });
//   //       } else {
//   //           var db = mongoConfig.getDb();
//   //           db.collection(COLLECTION_NAME).find({}).toArray(async function(err, configArray) {
//   //               if (err) {
//   //                   console.error("error in getConfiguration, ", err);
//   //                   client.close();
//   //                   res.status(500).send({code: "KO", object: null, error: err });
//   //               } else {
//   //                   client.close();
//   //                   res.status(200).send({code: "OK", object: configArray });
//   //               }
//   //           });
//   //       }
//   //   });

// }



// // // Function to save new entities in the database
// // async function guardarEntidades(entidades) {
// //   fs.writeFileSync(path.join(__dirname, 'jsons/_global_entities.json'), JSON.stringify({ entidades }));
// //   return {};
// // }

// // async function saveEntities(req, res) {

// //   const entidades = cargarEntidades();
// //   const entidadExistente = entidades.find(entity =>
// //     (entity._id && entity._id.toLowerCase() === req.body._id.toLowerCase()) ||
// //     (entity.companyName && entity.companyName.toLowerCase() === req.body.companyName.toLowerCase())
// //   );

// //   if (entidadExistente) {
// //     return res.status(409).json({ code: "DUPLICATE", message: "La entidad con ese identificador o nombre de compañía ya existe." });
// //   }

// //   req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);
// //   entidades.push(req.body);
// //   guardarEntidades(entidades);

// //   res.status(200).json({ code: "OK", object: entidades, message: "Entidad agregada con éxito." });

// //   const params = req.body;

// //     // mongoConfig.connectToServer( function( connectionError, client ) {
// //     //     if (connectionError) {
// //     //         res.status(500).send({code: "KO", object: null, error: connectionError });
// //     //     } else {
// //     //         var db = mongoConfig.getDb();
// //     //         db.collection(COLLECTION_NAME).insertOne(params,  function(err, result) {
// //     //             if (err) {
// //     //                 console.error("error in createConfiguration, ", err);
// //     //                 client.close();
// //     //                 res.status(500).send({code: "KO", object: null, error: err });
// //     //             } else {
// //     //                 client.close();
// //     //                 res.status(200).send({code: "OK", object: result });
// //     //             }
// //     //         });
// //     //     }
// //     // });

// // }
// async function saveEntities(req, res) {
//   try {
//     const entidadExistente = await entityExists(req.body._id); // Verifica si la entidad ya existe

//     if (entidadExistente) {
//       return res.status(409).json({ code: "DUPLICATE", message: "La entidad con ese identificador ya existe." });
//     }

//     req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

//     const result = await db.collection('_global_entities').insertOne(req.body); // Inserta la nueva entidad en la base de datos
//     const entidades = await loadEntities(); // Carga las entidades actualizadas

//     res.status(200).json({ code: "OK", object: entidades, message: "Entidad agregada con éxito." });
//   } catch (error) {
//     res.status(500).json({ code: "ERROR", message: "No se pudo agregar la entidad", error: error });
//   }
// }




// // function editEntities(req, res) {
// //   const entidades = cargarEntidades();
// //   const matchedEntityIndex = entidades.findIndex(entity => entity._id === req.body._id);

// //   if (matchedEntityIndex === -1) {
// //     return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
// //   }

// //   if (typeof req.body.isEnabled === 'string') {
// //     req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
// //   }

// //   entidades[matchedEntityIndex] = req.body;
// //   guardarEntidades(entidades);

// //   res.status(200).json({ code: "OK", object: entidades, message: "Entidad editada con éxito." });
// // }
// async function editEntities(req, res) {
//   try {
//     const entidadExistente = await entityExists(req.body._id); // Verifica si la entidad existe

//     if (!entidadExistente) {
//       return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
//     }

//     if (typeof req.body.isEnabled === 'string') {
//       req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
//     }

//     const filter = { _id: req.body._id };
//     const update = { $set: req.body };

//     const result = await db.collection('_global_entities').updateOne(filter, update); // Actualiza la entidad en la base de datos
//     const entidades = await loadEntities(); // Carga las entidades actualizadas

//     res.status(200).json({ code: "OK", object: entidades, message: "Entidad editada con éxito." });
//   } catch (error) {
//     res.status(500).json({ code: "ERROR", message: "No se pudo editar la entidad", error: error });
//   }
// }


// // function deleteEntity(req, res) {
// //   const entidades = cargarEntidades();
// //   const matchedEntityIndex = entidades.findIndex(entity => entity._id === req.body._id);

// //   if (matchedEntityIndex === -1) {
// //     return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
// //   }

// //   entidades.splice(matchedEntityIndex, 1);
// //   guardarEntidades(entidades);

// //   res.status(200).json({ code: "OK", object: entidades, message: "Entidad eliminada con éxito." });
// // }
// async function deleteEntity(req, res) {
//   try {
//     const entidadExistente = await entityExists(req.body._id); // Verifica si la entidad existe

//     if (!entidadExistente) {
//       return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
//     }

//     const filter = { _id: req.body._id };

//     const result = await db.collection('_global_entities').deleteOne(filter); // Elimina la entidad de la base de datos
//     const entidades = await loadEntities(); // Carga las entidades actualizadas

//     res.status(200).json({ code: "OK", object: entidades, message: "Entidad eliminada con éxito." });
//   } catch (error) {
//     res.status(500).json({ code: "ERROR", message: "No se pudo eliminar la entidad", error: error });
//   }
// }


// module.exports = {
//   obtenerEntidades,
//   saveEntities,
//   deleteEntity,
//   editEntities,
//   loadEntities,
//   entityExists
// };


// // 'use strict';

// // const { db } = require('../services/mongodb.service');

// // async function entityExists(entityId) {
// //   const filter = { _id: entityId };
// //   const result = await db.collection('_global_entities').findOne(filter);
// //   return result !== null;
// // }

// // async function loadEntities() {
// //   const rawData = await db.collection('_global_entities').find().toArray();
// //   return rawData[0].entidades;
// // }

// // async function obtenerEntidades(req, res) {
// //   try {
// //     const entidades = await loadEntities();
// //     if (entidades)
// //       res.status(200).json({ code: 'OK', object: entidades, message: '' });
// //     else
// //       res.status(404).json({ code: 'NOT_FOUND', message: 'No se pudieron recuperar las entidades' });
// //   } catch (err) {
// //     res.status(500).json({ message: 'No se pudieron recuperar las entidades' });
// //   }
// // }
// // async function formatEntityData(data) {
// //   // Asegúrate de que la estructura del objeto sea consistente
// //   return {
// //     _id: data._id, // Mantén el _id en el nivel superior
// //     companyName: data.companyName,
// //     description: data.description,
// //     isEnabled: data.isEnabled === 'true' || data.isEnabled === true,
// //     flag: data.flag
// //   };
// // }
// // async function saveEntities(req, res) {
// //   try {
// //     const formattedData = await formatEntityData(req.body);

// //     const entidadExistente = await entityExists(formattedData._id);

// //     if (entidadExistente) {
// //       return res.status(409).json({ code: 'DUPLICATE', message: 'La entidad con ese identificador ya existe.' });
// //     }

// //     const result = await db.collection('_global_entities').insertOne(formattedData);
// //     const entidades = await loadEntities();

// //     res.status(200).json({ code: 'OK', object: entidades, message: 'Entidad agregada con éxito.' });
// //   } catch (error) {
// //     res.status(500).json({ code: 'ERROR', message: 'No se pudo agregar la entidad', error: error });
// //   }
// // }

// // async function editEntities(req, res) {
// //   try {
// //     const entidadExistente = await entityExists(req.body._id);

// //     if (!entidadExistente) {
// //       return res.status(404).json({ code: 'NOT_FOUND', message: 'La entidad no existe.' });
// //     }

// //     if (typeof req.body.isEnabled === 'string') {
// //       req.body.isEnabled = req.body.isEnabled.toLowerCase() === 'true';
// //     }

// //     const filter = { _id: req.body._id };
// //     const update = { $set: req.body };

// //     const result = await db.collection('_global_entities').updateOne(filter, update);
// //     const entidades = await loadEntities();

// //     res.status(200).json({ code: 'OK', object: entidades, message: 'Entidad editada con éxito.' });
// //   } catch (error) {
// //     res.status(500).json({ code: 'ERROR', message: 'No se pudo editar la entidad', error: error });
// //   }
// // }

// // async function deleteEntity(req, res) {
// //   try {
// //     const entidadExistente = await entityExists(req.body._id);

// //     if (!entidadExistente) {
// //       return res.status(404).json({ code: 'NOT_FOUND', message: 'La entidad no existe.' });
// //     }

// //     const filter = { _id: req.body._id };

// //     const result = await db.collection('_global_entities').deleteOne(filter);
// //     const entidades = await loadEntities();

// //     res.status(200).json({ code: 'OK', object: entidades, message: 'Entidad eliminada con éxito.' });
// //   } catch (error) {
// //     res.status(500).json({ code: 'ERROR', message: 'No se pudo eliminar la entidad', error: error });
// //   }
// // }

// // module.exports = {
// //   obtenerEntidades,
// //   saveEntities,
// //   deleteEntity,
// //   editEntities,
// //   loadEntities,
// //   entityExists,
// // };

