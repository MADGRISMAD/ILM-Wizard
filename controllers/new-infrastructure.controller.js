const infraTypes = [
  {
    "id_Env": "dev",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "dev",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "pre",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "pre",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "prod",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "prod",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "test",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "test",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "stag",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "stag",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "demo",
    "identifier": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "demo",
    "identifier": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  }
]




function fetchInfrastructure(req, res) {
  res.status(200).json({code: "OK", object: infraTypes, message: ""});
}

function guardarInfraestructuras(req, res) {

  infraTypes.push(req.body);
  res.status(200).json({code: "OK", object: infraTypes, message: ""});

}

module.exports = {
  fetchInfrastructure,
  guardarInfraestructuras
};
