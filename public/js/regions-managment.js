$(document).ready(function () {

  obtenerYMostrarRegions();

  function obtenerYMostrarRegions() {
    $.ajax({
      url: '/newentities/obtenerRegions',
      type: 'GET',
      success: function (data) {
        if (data.code == "OK") {
          const regions = data.object;
          var regionList = document.getElementById("region-list");

          // Limpia la lista de regiones
          regionList.innerHTML = "";

          for (var i = 0; i < regions.length; i++) {
            var region = regions[i];

            var listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.id = "region" + (i + 1);
            listItem.textContent = region.identifier;

            regionList.appendChild(listItem);
          }
        }
      },
      error: function () {
        alert('Hubo un error al obtener los datos de las regiones.');
      }
    });
  }
});
