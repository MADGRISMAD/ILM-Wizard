const infraTypes = [
  {
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  // ... otros tipos de infraestructura
];



function obtenerInfraestructuras(req, res) {
  res.status(200).json({code: "OK", object: infraTypes, message: ""});
}

function guardarInfraestructuras(req, res) {

  infraTypes.push(req.body);
  res.status(200).json({code: "OK", object: infraTypes, message: ""});

}
