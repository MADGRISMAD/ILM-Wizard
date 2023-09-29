const environments = [
  {
    "identifier": "dev",
    "EnvName": "Development",
    "isEnabled": true
  },
  {
    "identifier": "pre",
    "EnvName": "Preproduction",
    "isEnabled": true
  },

  // ... otros entornos
];

function obtenerEnvironments(req, res) {
  res.status(200).json({code: "OK", object: environments, message: ""});


}

function guardarEnvironments(req, res) {

  environments.push(req.body);
  res.status(200).json({code: "OK", object: environments, message: ""});


}

module.exports = {
  obtenerEnvironments,
  guardarEnvironments
};
