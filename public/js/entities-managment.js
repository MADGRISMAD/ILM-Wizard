NewEntities.getEntitites().then(function (data) {
  //validar que entidades no sea null
  if (data.code == "OK") {
    console.log(data);
    var entidades = data.object;

    var _loop = function _loop(i) {
      var entidad = entidades[i];
      const option = document.createElement("p");
      const father = document.querySelector(".list-group");
      father.appendChild(option);
      option.innerHTML = entidad.name;
      option.addEventListener("click", function () {

      });
    };

    for (var i = 0; i < entidades.length; i++) {
      _loop(i);
    }
  } else {
    console.log("error");
  }
});




