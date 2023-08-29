NewEntities.getEntitites().then(function (data) {
  //TODO evaluar respuesta seg;un el code
  if (data.code === "OK") {
    console.log(data.object);
    //realizar validaciones de los datos, si viene vacio, si viene con datos, etc
    //si viene vacio, mostrar mensaje de error
    //si viene con datos, mostrar datos
    //si viene con error, mostrar mensaje de error
    //si es igual a 0 mostrar mensaje de error

    if (data.object.length === 0) {
      console.error("No hay datos");
    }
    else {

  }
  else {
    console.error(data.message);
      }


}).catch(function (error) {

  console.error(error);

});
