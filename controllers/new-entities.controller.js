const entidades = [
  {
    "_id": "5f8f1d5f8f1d5f8f1d5f8f1d",
    "identifier": "MX",
    "companyName": "MX",
    "description": "Description 1",
    "isEnabled": true,
    "flag": "assets/img/MEXICO.jpg"
  },
  {
    "identifier": "US",
    "companyName": "US",
    "description": "Description 2",
    "isEnabled": true,
    "flag": "assets/img/Usa.jpg"
  },

  // ... otras entidades
];





const availabilityZones = [
  {
    "identifier": "ohe",
    "name": "OHE",
    "isEnabled": true
  },
  {
    "identifier": "vmware",
    "name": "VMware",
    "isEnabled": true
  },
  // ... otras zonas de disponibilidad
];

const haList = [
  {
    "identifier": "ohe",
    "name": "OHE",
    "isEnabled": true,
    "skuSoftware": "SKU 1"
  },
  {
    "identifier": "vmware",
    "name": "VMware",
    "isEnabled": true,
    "skuSoftware": "SKU 2"
  },
  // ... otras HA
];

const metalByTenantList = [
  {
    "identifier": "Bronze",
    "name": "Bronze",
    "isEnabled": true,
    "skuSoftware": "SKU 3"
  },
  {
    "identifier": "Silver",
    "name": "Silver",
    "isEnabled": true,
    "skuSoftware": "SKU 4"
  },
  // ... otros metales por inquilino
];

const clusterTypes = [
  {
    "identifier": "Multicluster",
    "name": "Multicluster",
    "isEnabled": true
  },
  {
    "identifier": "Stretched",
    "name": "Stretched",
    "isEnabled": true
  },
  // ... otros tipos de clúster
];

const networkRegions = [
  {
    "identifier": "TIER 1",
    "name": "TIER1",
    "isEnabled": true
  },
  {
    "identifier": "TIER 2",
    "name": "TIER2",
    "isEnabled": true
  },
  // ... otras regiones de red
];

const disabledProducts = [
  "product1",
  "product2",
  // ... otros productos deshabilitados
];

const otherSoftwareProducts = [
  "software_product1",
  "software_product2",
  // ... otros productos de software
];

const activeDirectories = [
  {
    "domain": "domain1",
    "hidden - environment": "env1",
    "companlyAlias": "alias1"
  },
  {
    "domain": "domain2",
    "hidden - environment": "env2",
    "companlyAlias": "alias2"
  },
  // ... otros directorios activos
];

const nasList = [
  {
    "name": "NAS 1",
    "ip": "192.168.1.1",
    "isEnabled": true
  },
  {
    "name": "NAS 2",
    "ip": "192.168.1.2",
    "isEnabled": true
  },
  // ... otras NAS
];

const clusterClasses = [
  {
    "identifier": "Class 1",
    "name": "Cluster Class 1",
    "isEnabled": true
  },
  {
    "identifier": "Class 2",
    "name": "Cluster Class 2",
    "isEnabled": true
  },
  // ... otras clases de clúster
];

const businessTypes = [
  {
    "identifier": "Type 1",
    "name": "Business Type 1",
    "isEnabled": true
  },
  {
    "identifier": "Type 2",
    "name": "Business Type 2",
    "isEnabled": true
  },
  // ... otros tipos de negocio
];

//entity------------------------------------------------------------------------------------------------------------------------------
function obtenerEntidades(req, res) {

    res.status(200).json({code: "OK", object: entidades, message: ""});
}

function saveEntities(req, res) {
  // Verificar si ya existe una entidad con el mismo identificador o nombre de compañía
  const entidadExistente = entidades.find(entity =>
      (entity.identifier && entity.identifier.toLowerCase() === req.body.identifier.toLowerCase()) ||
      (entity.companyName && entity.companyName.toLowerCase() === req.body.companyName.toLowerCase())
  );

  // Si la entidad ya existe
  if (entidadExistente) {
      return res.status(409).json({code: "DUPLICATE", message: "La entidad con ese identificador o nombre de compañía ya existe."});
  }

  // Convertir isEnabled a booleano (por si acaso)
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

  // Si la entidad no existe, la añade
  entidades.push(req.body);
  res.status(200).json({code: "OK", object: entidades, message: "Entidad agregada con éxito."});
}

function editEntities(req, res) {

  // Obtener el índice de la entidad a editar con matchEntity
  const matchedEntityIndex = entidades.findIndex(entity => entity.identifier === req.body.identifier);

  // Si no existe la entidad
  if (matchedEntityIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
  }


// Convertir la propiedad isEnabled a booleano si es un string
if (typeof req.body.isEnabled === 'string') {
  req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
}

  // Si existe la entidad
  entidades[matchedEntityIndex] = req.body;
  res.status(200).json({ code: "OK", object: entidades, message: "Entidad editada con éxito." });
}

function deleteEntity(req, res) {

  // Obtener el índice de la entidad a eliminar con matchEntity
  const matchedEntityIndex = entidades.findIndex(entity => entity.identifier === req.body.identifier);

  // Si no existe la entidad
  if (matchedEntityIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La entidad no existe." });
  }

  // Si existe la entidad, la elimina
  entidades.splice(matchedEntityIndex, 1);
  res.status(200).json({ code: "OK", object: entidades, message: "Entidad eliminada con éxito." });

}







function obtenerAvailabilityZones(req, res) {
  if(req.body.availabilityZones) {
    res.status(200).json({code: "OK", object: availabilityZones, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "availabilityZones ID empty"})
  }
}

function obtenerHaList(req, res) {
  if(req.body.haList) {
    res.status(200).json({code: "OK", object: haList, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "haList ID empty"})
  }
}

function obtenerMetalByTenantList(req, res) {
  if(req.body.metalByTenantList) {
    res.status(200).json({code: "OK", object: metalByTenantList, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "metalByTenantList ID empty"})
  }
}

function obtenerClusterTypes(req, res) {
  if(req.body.clusterTypes) {
    res.status(200).json({code: "OK", object: clusterTypes, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "clusterTypes ID empty"})
  }
}

function obtenerNetworkRegions(req, res) {
  if(req.body.networkRegions) {
    res.status(200).json({code: "OK", object: networkRegions, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "networkRegions ID empty"})
  }
}

function obtenerDisabledProducts(req, res) {
  if(req.body.disabledProducts) {
    res.status(200).json({code: "OK", object: disabledProducts, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "disabledProducts ID empty"})
  }
}

function obtenerOtherSoftwareProducts(req, res) {
  if(req.body.otherSoftwareProducts) {
    res.status(200).json({code: "OK", object: otherSoftwareProducts, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "otherSoftwareProducts ID empty"})
  }
}

function obtenerActiveDirectories(req, res) {
  if(req.body.activeDirectories) {
    res.status(200).json({code: "OK", object: activeDirectories, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "activeDirectories ID empty"})
  }
}

function obtenerNasList(req, res) {
  if(req.body.nasList) {
    res.status(200).json({code: "OK", object: nasList, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "nasList ID empty"})
  }
}

function obtenerClusterClasses(req, res) {
  if(req.body.clusterClasses) {
    res.status(200).json({code: "OK", object: clusterClasses, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "clusterClasses ID empty"})
  }
}

function obtenerBusinessTypes(req, res) {
  if(req.body.businessTypes) {
    res.status(200).json({code: "OK", object: businessTypes, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "businessTypes ID empty"})
  }
}









module.exports = {

  obtenerEntidades,
  obtenerAvailabilityZones,
  obtenerHaList,
  obtenerMetalByTenantList,
  obtenerClusterTypes,
  obtenerNetworkRegions,
  obtenerDisabledProducts,
  obtenerOtherSoftwareProducts,
  obtenerActiveDirectories,
  obtenerNasList,
  obtenerClusterClasses,
  obtenerBusinessTypes,
  saveEntities,
  deleteEntity,
  editEntities,



  entidades,
  availabilityZones,
  haList,
  metalByTenantList,
  clusterTypes,
  networkRegions,
  disabledProducts,
  otherSoftwareProducts,
  activeDirectories,
  nasList,
  clusterClasses,
  businessTypes,

};









