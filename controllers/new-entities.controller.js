
const catalogo = [
  {
    id: 1,
    name: "Compañía 1",
    region: "Región 1",
    descripcion: "Descripción de la compañía 1",
    icon: "Icono 1",
    isEnable: true,
    createdAt: "2021-01-01T00:00:00.000Z",
    updatedAt: "2021-01-01T00:00:00.000Z",
    createdBy: "Usuario que creó",
    updatedBy: "Usuario que actualizó",
    deletedBy: "Usuario que eliminó",
    deletedAt: "2021-01-01T00:00:00.000Z",
  },
  // ... otras compañías
];
const entidades = [
  {
    id: 1,
    name: "Nombre de la entidad",
    unitName: "Nombre de la unidad",
      fullName: "Nombre completo de la entidad",
      nickname: "Alias de la entidad",
      region: "Región de la entidad",
      companyDelivery: "Empresa de entrega de la entidad",
      vdc: "VDC de la entidad",
      isEnable: true,
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
      createdBy: "Usuario que creó",
      updatedBy: "Usuario que actualizó",
      deletedBy: "Usuario que eliminó",
      deletedAt: "2021-01-01T00:00:00.000Z",
  }

];



const infraestructura = [
  {
    id: 1,
    name: "mexico",
    company: "Compañía 1",

    types: [
      {
        name: "type1",
        infraestructuras: [
          {
            name: "name",
            value: "openstack",
            itsEnable: true,
            envs: [
              {
                name: "pre",
                identifiers: ["id1", "id2"],
                itsEnable: true,
              },
              {
                name: "dev",
                identifiers: ["id3"],
                itsEnable: true,
              },
              {
                name: "pro",
                identifiers: ["id4", "id5"],
                itsEnable: true,
              },
              {
                name: "dmz",
                identifiers: ["id6"],
                itsEnable: true,
              },
            ],
          },
          {
            name: "mware",
            value: "OHC",
            itsEnable: false,
            envs: [
              {
                name: "pre",
                identifiers: ["id1", "id2"],
                itsEnable: true,
              },
              {
                name: "dev",
                identifiers: ["id3"],
                itsEnable: true,
              },
              {
                name: "pro",
                identifiers: ["id4", "id5"],
                itsEnable: true,
              },
              {
                name: "dmz",
                identifiers: ["id6"],
                itsEnable: true,
              },
            ],
          },
          {
            name: "VMware",
            value: "Infraestructura 3",
            itsEnable: true,
            envs: [
              {
                name: "pre",
                identifiers: ["id1", "id2"],
                itsEnable: true,
              },
              {
                name: "dev",
                identifiers: ["id3"],
                itsEnable: true,
              },
              {
                name: "pro",
                identifiers: ["id4", "id5"],
                itsEnable: true,
              },
              {
                name: "dmz",
                identifiers: ["id6"],
                itsEnable: true,
              },
            ],
          },
        ],
      }
    ],
  }
];

const logChanges = [
  {
    id: 1,
    timestamp: "2023-08-17T12:00:00.000Z",
    action: "Creación",
    entityType: "Compañía",
    entityId: 1,
    oldValue: null,
    newValue: {
      id: 1,
      name: "Compañía 1",
      region: "Región 1",
      descripcion: "Descripción de la compañía 1",
      icon: "Icono 1",
      entidad: {
        id: 1,
        name: "Nombre de la entidad",
        unitName: "Nombre de la unidad",
        fullName: "Nombre completo de la entidad",
        nickname: "Alias de la entidad",
        region: "Región de la entidad",
        companyDelivery: "Empresa de entrega de la entidad",
        vdc: "VDC de la entidad",
        isEnable: true,
        createdAt: "2021-01-01T00:00:00.000Z",
        updatedAt: "2021-01-01T00:00:00.000Z",
        createdBy: "Usuario que creó",
        updatedBy: "Usuario que actualizó",
        deletedBy: "Usuario que eliminó",
        deletedAt: "2021-01-01T00:00:00.000Z",
      },
      isEnable: true,
      createdAt: "2021-01-01T00:00:00.000Z",
      updatedAt: "2021-01-01T00:00:00.000Z",
      createdBy: "Usuario que creó",
      updatedBy: "Usuario que actualizó",
      deletedBy: "Usuario que eliminó",
      deletedAt: "2021-01-01T00:00:00.000Z",
    },
    user: "Usuario que realizó la acción",
  },
  // ... otros cambios
];



function obtenerCatalogo() {
  return catalogo;
}

function obtenerInfraestructura() {
  return infraestructura;
}
function obtenerEntidades(req, res) {

  res.status(200).json({code: "OK", object: entidades, message: ""});

}

module.exports = {
  obtenerCatalogo,
  obtenerInfraestructura,
  logChanges,
  obtenerEntidades
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
