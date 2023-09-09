const entidades = [
  {
    "identifier": "MX",
    "companyName": "Company 1",
    "description": "Description 1",
    "isEnabled": true,
    "flag": "Flag 1"
  },
  {
    "identifier": "US",
    "companyName": "Company 2",
    "description": "Description 2",
    "isEnabled": true,
    "flag": "Flag 2"
  },
  {
    "identifier": "US",
    "companyName": "Company 2",
    "description": "Description 2",
    "isEnabled": true,
    "flag": "Flag 2"
  },
  // ... otras entidades
];




const companies = [
  {
    "identifier": "imx",
    "Company": "Company 1",
    "Hostname prefix": "mxr",
    "Region or client code": "Region 1",
    "Delivery": "Delivery 1",
    "VDC": "VDC 1",
    "CMDB company": "CMDB Company 1",
    "isEnabled": true,
    "select": "di",
    "short_name": "BSMX",
    "nicName": "nic",
    "region": "mx"
  },
  {
    "identifier": "imx",
    "Company": "Company 1",
    "Hostname prefix": "mxr",
    "Region or client code": "Region 1",
    "Delivery": "Delivery 1",
    "VDC": "VDC 1",
    "CMDB company": "CMDB Company 1",
    "isEnabled": true,
    "select": "di",
    "short_name": "BSMX",
    "nicName": "nic",
    "region": "mx"
  },
  {
    "identifier": "us",
    "Company": "Company 2",
    "Hostname prefix": "mxr",
    "Region or client code": "Region 1",
    "Delivery": "Delivery 1",
    "VDC": "VDC 1",
    "CMDB company": "CMDB Company 1",
    "isEnabled": true,
    "select": "di",
    "short_name": "BSMX",
    "nicName": "nic",
    "region": "mx"
  },
  {
    "identifier": "us",
    "Company": "Company 2",
    "Hostname prefix": "usb",
    "Region or client code": "Region 2",
    "Delivery": "Delivery 2",
    "VDC": "VDC 2",
    "CMDB company": "CMDB Company 2",
    "isEnabled": true,
    "select": "usa",
    "short_name": "BSUS",
    "nicName": "nicus",
    "region": "us"
  },
  // ... otras compañías
];


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
const environmentsEntity = [
  {
    "EnviromentId":"dasdsa",
    "EntityId":"dasdsa",
    "isEnabled": true
  }
]


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


function obtenerEntidades(req, res) {

    res.status(200).json({code: "OK", object: entidades, message: ""});

}

function guardarEntidades(req, res) {

   entidades.push(req.body);
   res.status(200).json({code: "OK", object: entidades, message: ""});

}



function obtenerCompanies(req, res) {

    res.status(200).json({code: "OK", object: companies, message: ""});

}


function obtenerEnvironments(req, res) {
  if(req.body.environments) {
    res.status(200).json({code: "OK", object: environments, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "environments ID empty"})
  }
}

function obtenerInfraTypes(req, res) {
  if(req.body.infraTypes) {
    res.status(200).json({code: "OK", object: infraTypes, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "infraTypes ID empty"})
  }
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
  obtenerCompanies,
  obtenerEnvironments,
  obtenerInfraTypes,
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
  guardarEntidades,
  entidades,
  companies,
  environments,
  infraTypes,
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
  environmentsEntity
};
// "use strict"
// const ejemplo = ((req, res) => {

//   console.log(req.body);
//   const {data,nombre,apellido}=req.body;
//   const id = req.body;
//   res.status(200).json({message: "ok", data, nombre, id});

// } )

// module.exports = {
//   ejemplo

// En el controlador en "controller"









