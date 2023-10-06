const qtr =[
  {
    "_id": "1",
    "id_Env": "dev",
    "isenabled": true,

  },
  {
    "_id": "2",
    "id_Env": "pre",
    "isenabled": true,

  },
  {
    "_id": "3",
    "id_Env": "prod",
    "isenabled": true,

  },
  {
    "_id": "4",
    "id_Env": "test",
    "isenabled": true,

  },

]

const otherSoftware = [
  {
    "_id": "1",
    "id_Env": "dev",
    "isenabled": true,

  },
  {
    "_id": "2",
    "id_Env": "pre",
    "isenabled": true,

  },
  {
    "_id": "3",
    "id_Env": "prod",
    "isenabled": true,

  },
  {
    "_id": "4",
    "id_Env": "test",
    "isenabled": true,

  },

]


const HA  = [
  {
    "_id": "1",
    "id_Env": "dev",
    "isenabled": true,

  },
  {
    "_id": "2",
    "id_Env": "pre",
    "isenabled": true,

  },
  {
    "_id": "3",
    "id_Env": "prod",
    "isenabled": true,

  },
  {
    "_id": "4",
    "id_Env": "test",
    "isenabled": true,

  },

]







function fetchCatalogs(req, res) {
 //create a new object with the catalogs
  const catalogs = {
      qtr: qtr,
      otherSoftware: otherSoftware,
      HA: HA
  };

  // Send the response
  res.status(200).json({ code: "OK", object: catalogs, message: "Catálogos obtenidos con éxito" });
}


module.exports = {
  fetchCatalogs,
  qtr,
  otherSoftware,
  HA

}

