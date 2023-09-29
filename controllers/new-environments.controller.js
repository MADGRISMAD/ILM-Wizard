const environments = [
  {
    "identifier": "dev",
    "EnvName": "Development",
    "isEnabled": true,
    "regionId": "region1"
  },
  {
    "identifier": "pre",
    "EnvName": "Preproduction",
    "isEnabled": true,
    "regionId": "region2"
  },
  {
    "identifier": "prod",
    "EnvName": "Production",
    "isEnabled": true,
    "regionId": "region1"
  },
  {
    "identifier": "test",
    "EnvName": "Testing",
    "isEnabled": true,
    "regionId": "region2"
  },
  {
    "identifier": "stag",
    "EnvName": "Staging",
    "isEnabled": true,
    "regionId": "region1"
  },
  {
    "identifier": "demo",
    "EnvName": "Demo",
    "isEnabled": true,
    "regionId": "region2"
  }
  // ... otros entornos
];

function obtenerEnvironments(req, res) {

  res.status(200).json({code: "OK", object: environments, message: ""});


}

function guardarEnvironments(req, res) {

  environments.push(req.body);
  res.status(200).json({code: "OK", object: environments, message: ""});


}
function fetchEnvironmentById(req, res) {
  const envId = req.query.identifier; // Asume que el identificador se envía como un parámetro de consulta

  // Busca el entorno por su identificador
  const environment = environments.find(e => e.identifier === envId);

  if (environment) {
      // Si se encuentra el entorno, devuelve un estado 200 y el entorno
      res.status(200).json({ code: "OK", object: environment, message: "" });
  } else {
      // Si no se encuentra, devuelve un estado 404 y un mensaje de error
      res.status(404).json({ code: "NOT_FOUND", message: "Entorno no encontrado" });
  }

}


function toggleEnvironmentsStatus(req, res) {

  // Validar que req.body es un objeto y no es nulo
  if (typeof req.body !== 'object' || req.body === null) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "El cuerpo de la petición es inválido." });
  }

  // Validar que la propiedad 'isEnabled' está presente
  if (!('isEnabled' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad isEnabled es requerida." });
  }

  // Validar que la propiedad 'identifier' está presente
  if (!('identifier' in req.body)) {
    return res.status(400).json({ code: "BAD_REQUEST", message: "La propiedad identifier es requerida." });
  }

  const matchedEnvironmentIndex = environments.findIndex(env => env.identifier === req.body.identifier);

  // Si no existe el entorno
  if (matchedEnvironmentIndex === -1) {
    return res.status(404).json({ code: "NOT_FOUND", message: "El entorno no existe." });
  }

  // Convertir la propiedad isEnabled a booleano si es un string
  const isEnabled = typeof req.body.isEnabled === 'string' ? req.body.isEnabled.toLowerCase() === "true" : req.body.isEnabled;


  // Si existe el entorno, actualizar solo el campo isEnabled
  environments[matchedEnvironmentIndex].isEnabled = isEnabled;

  res.status(200).json({ code: "OK", object: environments[matchedEnvironmentIndex], message: "Estado del entorno actualizado con éxito." });
}


module.exports = {
  obtenerEnvironments,
  guardarEnvironments,
  toggleEnvironmentsStatus,
  fetchEnvironmentById

};
