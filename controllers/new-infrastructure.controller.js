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


// Fetch a list of all infrastructures
function fetchInfrastructure(req, res) {
  res.status(200).json({ code: "OK", object: infraTypes, message: "" });
}

// Toggle the status of a specific infrastructure
function toggleInfrastructureStatus(req, res) {
  const { identifier, isEnabled } = req.body;

  const index = infraTypes.findIndex(infra => infra.identifier === identifier);
  if (index !== -1) {
    infraTypes[index].isEnabled = isEnabled;
    res.status(200).json({ code: "OK", message: "Infrastructure status updated." });
  } else {
    res.status(400).json({ code: "ERROR", message: "Infrastructure not found." });
  }
}

// Fetch a specific infrastructure by its ID
function fetchInfrastructureById(req, res) {
  const { identifier } = req.query;

  const infrastructure = infraTypes.find(infra => infra.identifier === identifier);
  if (infrastructure) {
    res.status(200).json({ code: "OK", object: infrastructure, message: "" });
  } else {
    res.status(400).json({ code: "ERROR", message: "Infrastructure not found." });
  }
}


module.exports = {
  fetchInfrastructure,
  toggleInfrastructureStatus,
  fetchInfrastructureById,

};
