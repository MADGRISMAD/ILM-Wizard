const fs = require('fs');
const path = require('path');

// Para cargar el JSON principal
function cargarEnvironments() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_environments.json'));
  return JSON.parse(rawData).environments;
}

// Para cargar el JSON del catálogo
function cargarCatalogoEnviroments() {
  const rawData = fs.readFileSync(path.join(__dirname, 'jsons/_global_cat_enviroments.json'));
  return JSON.parse(rawData).environments;
}

function guardarEnvironmentsData(environments) {
  fs.writeFileSync(path.join(__dirname, 'jsons/_global_environments.json'), JSON.stringify({ environments }, null, 4));
}







function obtenerEnvironments(req, res) {
  const environments = cargarEnvironments();
  res.status(200).json({ code: "OK", object: environments, message: "" });
}

function obtenerCatalogoEnviroments(req, res) {
  const catalogo = cargarCatalogoEnviroments();
  res.status(200).json({ code: "OK", object: catalogo, message: "" });
}

function guardarEnvironments(req, res) {
  const environments = cargarEnvironments();
  environments.push(req.body);
  guardarEnvironmentsData(environments);
  res.status(200).json({ code: "OK", object: environments, message: "Entorno agregado con éxito." });
}

function fetchEnvironmentById(req, res) {
  const environments = cargarEnvironments();
  const envId = req.query._id;

  let environment = environments.find(e => e._id === envId);

  if (!environment) {
    environment = {
      _id: envId,
      // Aquí puedes agregar propiedades iniciales para el nuevo entorno
      isEnabled: false
    };
    environments.push(environment);
    guardarEnvironmentsData(environments);
  }

  res.status(200).json({ code: "OK", object: environment, message: "" });
}

function toggleEnvironmentsStatus(req, res) {
  const environments = cargarEnvironments();
  const envId = req.body._id;
  const parentId = req.body.parent_id;
  console.log("Received request with parent_id:", parentId); // Registro para parent_id

  const isEnabled = req.body.isEnabled === true;

  const existingEnvironment = environments.find(env => env._id === envId && env.parent_id === parentId);

  if (!existingEnvironment) {
      environments.push({
          _id: envId,
          parent_id: parentId,  // Guardamos el parent_id
          isEnabled: isEnabled
      });
  } else {
      existingEnvironment.isEnabled = isEnabled;
  }

  guardarEnvironmentsData(environments);
  res.status(200).json({ code: "OK", object: { _id: envId, isEnabled: isEnabled, parent_id: parentId }, message: "Estado del entorno actualizado con éxito." });
}
















module.exports = {
  obtenerEnvironments,
  obtenerCatalogoEnviroments,
  guardarEnvironments,
  toggleEnvironmentsStatus,
  fetchEnvironmentById
};
