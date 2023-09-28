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




const companies = [
  {

    "identifier": "imx",
    "Company": "MX",
    "entity_id": "MX",
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
    "Company": "US",
    "entity_id": "US",
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
  // ... otras compañías
];

const regions = [
  {
    "entity_id": "MX",
    "identifier": "Region 1",
    "Region": "Region 1",
    "isEnabled": true
  },
  {
    "entity_id": "US",
    "identifier": "Region 2",
    "Region": "Region 2",
    "isEnabled": true
  },
  {
    "entity_id": "MX",
    "identifier": "Region 3",
    "Region": "Region 3",
    "isEnabled": true
  },
  {
    "entity_id": "US",
    "identifier": "Region 4",
    "Region": "Region 4",
    "isEnabled": true
  },
  // ... otras regiones
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





function fetchRegions(req, res) {
  const entityId = req.query.entity_id; // Obteniendo entity_id desde la consulta

  if (!entityId) {
      return res.status(400).json({code: "ERROR", message: "Falta el parámetro entity_id."});
  }

  const filteredRegions = regions.filter(region => region.entity_id === entityId);

  res.status(200).json({code: "OK", object: filteredRegions, message: ""});
}


function fetchRegionById(req, res) {
  const regionId = req.query.identifier; // Asume que el identificador se envía como un parámetro de consulta

  // Busca la región por su identificador
  const region = regions.find(r => r.identifier === regionId);

  if (region) {
      // Si se encuentra la región, devuelve un estado 200 y la región
      res.status(200).json({ code: "OK", object: region, message: "" });
  } else {
      // Si no se encuentra, devuelve un estado 404 y un mensaje de error
      res.status(404).json({ code: "NOT_FOUND", message: "Región no encontrada" });
  }
}

function saveRegions(req, res) {

  // Verificar si ya existe una región con el mismo identificador
  const regionExistente = regions.find(region =>
      region.identifier && region.identifier.toLowerCase() === req.body.identifier.toLowerCase()
  );

  // Si la región ya existe
  if (regionExistente) {
      return res.status(409).json({code: "DUPLICATE", message: "La región con ese identificador ya existe."});
  }

  // Convertir isEnabled a booleano (por si acaso)
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

  // Si la región no existe, la añade
  regions.push(req.body);
  res.status(200).json({code: "OK", object: regions, message: "Región agregada con éxito."});
}

function editRegions(req, res) {

  const matchedRegionIndex = regions.findIndex(region => region.identifier === req.body.identifier);

  // Si no existe la región
  if (matchedRegionIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  // Convertir la propiedad isEnabled a booleano si es un string
  if (typeof req.body.isEnabled === 'string') {
    req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  // Si existe la región
  regions[matchedRegionIndex] = req.body;
  res.status(200).json({ code: "OK", object: regions, message: "Región editada con éxito." });
}

function deleteRegion(req, res) {

  // Obtener el identificador de la región desde el parámetro de ruta
  const regionIdentifier = req.params.identifier;

  // Obtener el índice de la región a eliminar usando el identificador
  const matchedRegionIndex = regions.findIndex(region => region.identifier === regionIdentifier);

  // Si no existe la región
  if (matchedRegionIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La región no existe." });
  }

  // Si existe la región, la elimina
  regions.splice(matchedRegionIndex, 1);
  res.status(200).json({ code: "OK", object: regions, message: "Región eliminada con éxito." });
}






function getCompanies(req, res) {

    res.status(200).json({code: "OK", object: companies, message: ""});

}

function getCompanyById(req, res) {
  const companyId = req.query.identifier; // Asume que el identificador se envía como un parámetro de consulta

  // Busca la compañía por su identificador
  const company = companies.find(c => c.identifier === companyId);

  if (company) {
      // Si se encuentra la compañía, devuelve un estado 200 y la compañía
      res.status(200).json({ code: "OK", object: company, message: "" });
  } else {
      // Si no se encuentra, devuelve un estado 404 y un mensaje de error
      res.status(404).json({ code: "NOT_FOUND", message: "Compañía no encontrada" });
  }
}


function saveCompanies(req, res) {
  // Verificar si ya existe una compañía con el mismo identificador o nombre de compañía
  const companyExistente = companies.find(company =>
      (company.identifier && company.identifier.toLowerCase() === req.body.identifier.toLowerCase()) ||
      (company.company && company.company.toLowerCase() === req.body.company.toLowerCase())
  );

  // Si la compañía con ese identificador o nombre ya existe
  if (companyExistente) {
      return res.status(409).json({code: "DUPLICATE", message: "La compañía con ese identificador o nombre ya existe."});
  }

  // Convertir isEnabled a booleano (por si acaso)
  req.body.isEnabled = (req.body.isEnabled === 'true' || req.body.isEnabled === true);

  // Si la compañía no existe, la añade
  companies.push(req.body);
  res.status(200).json({code: "OK", object: companies, message: "Compañía agregada con éxito."});
}



function editCompanies(req, res) {

  // Obtener el índice de la compañía a editar con matchedCompany
  const matchedCompanyIndex = companies.findIndex(company => company.identifier === req.body.identifier);

  // Si no existe la compañía
  if (matchedCompanyIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  // Convertir la propiedad isEnabled a booleano si es un string
  if (typeof req.body.isEnabled === 'string') {
      req.body.isEnabled = req.body.isEnabled.toLowerCase() === "true";
  }

  // Si existe la compañía
  companies[matchedCompanyIndex] = req.body;
  res.status(200).json({ code: "OK", object: companies, message: "Compañía editada con éxito." });
}



function eliminarCompany(req, res) {

  // Obtener el identificador de la compañía desde el parámetro de ruta
  const companyIdentifier = req.params.identifier;

  // Obtener el índice de la compañía a eliminar usando el identificador
  const matchedCompanyIndex = companies.findIndex(company => company.identifier === companyIdentifier);

  // Si no existe la compañía
  if (matchedCompanyIndex === -1) {
      return res.status(404).json({ code: "NOT_FOUND", message: "La compañía no existe." });
  }

  // Si existe la compañía, la elimina
  companies.splice(matchedCompanyIndex, 1);
  res.status(200).json({ code: "OK", object: companies, message: "Compañía eliminada con éxito." });
}







function obtenerEnvironments(req, res) {
  res.status(200).json({code: "OK", object: environments, message: ""});


}

function guardarEnvironments(req, res) {

  environments.push(req.body);
  res.status(200).json({code: "OK", object: environments, message: ""});


}

function obtenerInfraestructuras(req, res) {
  res.status(200).json({code: "OK", object: infraTypes, message: ""});
}

function guardarInfraestructuras(req, res) {

  infraTypes.push(req.body);
  res.status(200).json({code: "OK", object: infraTypes, message: ""});

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
  getCompanies,
  obtenerEnvironments,
  obtenerInfraestructuras,
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
  saveCompanies,
  guardarEnvironments,
  guardarInfraestructuras,
  fetchRegions,
  editEntities,
  getCompanyById,
  editCompanies,
  eliminarCompany,
  fetchRegionById,
  saveRegions,
  editRegions,
  deleteRegion,




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
  environmentsEntity,
  regions
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









