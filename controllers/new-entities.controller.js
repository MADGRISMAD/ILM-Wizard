
const entidades = [
  {
    "identifier": "MX",
    "companyName": "Company Name 1",
    "description": "Description 1",
    "isEnabled": true,
    "flag": "Flag 1"
  },
  {
    "identifier": "US",
    "companyName": "Company Name 2",
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


  if(req.body.idRegion) {

    //TODO flujo normal
    res.status(200).json({code: "OK", object: entidades, message: ""});
  } else {
    res.status(201).json({code: "ERROR" , object: null, message: "Region ID empty"})
  }




}



module.exports = {

  obtenerEntidades,
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

