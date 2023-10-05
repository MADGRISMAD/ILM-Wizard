const infraTypes = [
  {
    "id_Env": "dev",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "dev",
    "_id": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "pre",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "pre",
    "_id": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "prod",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "prod",
    "_id": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "test",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "test",
    "_id": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "stag",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "stag",
    "_id": "vmware",
    "infraName": "VMware",
    "isEnabled": true
  },
  {
    "id_Env": "demo",
    "_id": "ohe",
    "infraName": "OHE",
    "isEnabled": true
  },
  {
    "id_Env": "demo",
    "_id": "vmware",
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
  const { _id, isEnabled } = req.body;

  const index = infraTypes.findIndex(infra => infra._id === _id);
  if (index !== -1) {
    infraTypes[index].isEnabled = isEnabled;
    res.status(200).json({ code: "OK", message: "Infrastructure status updated." });
  } else {
    res.status(400).json({ code: "ERROR", message: "Infrastructure not found." });
  }
}

// Fetch a specific infrastructure by its ID
function fetchInfrastructureById(req, res) {
  const { _id } = req.query;

  const infrastructure = infraTypes.find(infra => infra._id === _id);
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
