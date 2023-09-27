let matchedRegion = null;  // Variable para almacenar la región seleccionada

let matchedCompanyEntityId = null; // Deberías asignar esto al entity_id de la compañía seleccionada.


// update the entity card
$(document).ready(function () {
  $("#confirmRegion").click(function() {
      if (matchedEntity) {
          actualizarTarjetaRegion(matchedEntity);
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una tarjeta antes de confirmar.',
          });
      }
  });

  function actualizarTarjetaRegion(entidades) {
      if (!entidades.flag || !entidades.regionName) { // Cambiado de companyName a regionName
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Los datos de la entidad son incompletos o no válidos.',
          });
          return;  // Salir de la función si los datos no son válidos
      }

      // Actualizar el logo de la región
      const imgElement = $("#regionIMG");  // Cambiado de infraIMG a regionIMG
      if (!imgElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo encontrar el elemento para la imagen.',
          });
          return;  // Salir de la función si no se encuentra el elemento
      }
      imgElement.attr("src", entidades.flag);

      // Actualizar el nombre de la región
      const nameElement = $("#region-name");  // Cambiado de company-name a region-name
      if (!nameElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo encontrar el elemento para el nombre de la región.',
          });
          return;  // Salir de la función si no se encuentra el elemento
      }
      nameElement.text(entidades.regionName);  // Cambiado de companyName a regionName
  }
});


//despliega la lista de regiones

$(document).ready(function () {
  var regionList = document.getElementById("Region-list");

  $("#confirmCompany").click(function() {
      regionList.innerHTML = "";  // Limpia la lista de regiones.
      if (matchedCompany) {  // Asegúrate de que la compañía esté seleccionada
          obtenerYMostrarRegions(matchedCompany.entity_id);
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una compañía antes de continuar.',
          });
      }
  });

  function obtenerYMostrarRegions(selectedEntityId) {
      // Realiza una solicitud AJAX para obtener los datos de las regiones
      $.ajax({
          url: '/newentities/obtenerRegions',
          type: 'GET',
          data: { entity_id: selectedEntityId },  // Enviando entity_id como un parámetro de consulta
          success: function(data) {
              if (data.code == "OK") {
                  const filteredRegions = data.object;

                  for (var i = 0; i < filteredRegions.length; i++) {
                      var region = filteredRegions[i];

                      var listItem = document.createElement("li");
                      listItem.className = "list-group-item d-flex justify-content-between align-items-center";
                      listItem.id = "region" + region.identifier;
                      listItem.textContent = region.identifier;

                      // Si la región tiene isEnabled en false, sombrear en gris y agregar "DISABLE"
                      if (!region.isEnabled) {
                          listItem.style.backgroundColor = "#d3d3d3"; // gris claro
                          listItem.textContent += " (DISABLE)";
                      }

                      regionList.appendChild(listItem);
                  }
              }
          },
          error: function() {
              alert('Hubo un error al obtener los datos de las regiones.');
          }
      });
  }
});





// Select a region from the list
function selectRegion(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#Region-list li').removeClass('selected');

  // 2. Extract identifier from tagId
  const regionId = tagId.replace('region', '');

  // 3. Realizar una solicitud AJAX para obtener los datos de la región por su identificador
  $.ajax({
    url: '/newentities/obtenerRegionPorId',  // Ruta del servidor donde se obtiene la región por ID
    type: 'GET',
    data: { identifier: regionId },  // Enviar el identificador como parámetro
    success: function(data) {
      if (data.code == "OK") {
        matchedRegion = data.object;

        if (matchedRegion) {
          // 4. Add 'selected' class to the list item
          $(`#${tagId}`).addClass('selected');
          console.log("región encontrada", matchedRegion);
        } else {
          console.log("región no encontrada en la base de datos");
          console.log("ID buscado:", regionId);
        }

      } else {
        console.log("Error al obtener la región:", data.message);
      }
    },
    error: function() {
      console.log("Error al realizar la petición AJAX para obtener la región");
    }
  });
}

// Event listener for click on list items
$(document).on('click', '#Region-list li', function() {
  selectRegion(this.id);
});







// update the entity card
$(document).ready(function () {
  $("#confirmCompany").click(function() {
      if (matchedEntity) {
          actualizarTarjeta(matchedEntity);
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una tarjeta antes de confirmar.',
          });
      }
  });

  function actualizarTarjeta(entidades) {
      if (!entidades.flag || !entidades.companyName) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Los datos de la entidad son incompletos o no válidos.',
          });
          return;  // Salir de la función si los datos no son válidos
      }

      // Actualizar el logo de la entidad
      const imgElement = $("#regionIMG");
      if (!imgElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo encontrar el elemento para la imagen.',
          });
          return;  // Salir de la función si no se encuentra el elemento
      }
      imgElement.attr("src", entidades.flag);

      // Actualizar el nombre de la entidad
      const nameElement = $("#Region-name");
      if (!nameElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo encontrar el elemento para el nombre de la entidad.',
          });
          return;  // Salir de la función si no se encuentra el elemento
      }
      nameElement.text(entidades.companyName);
  }
});




$(document).ready(function () {
 // Variable para almacenar la región seleccionada

  // Agregar un evento de clic al botón de confirmación
  $("#confirmRegion").click(function() {
      if (matchedRegion) {
          if (!matchedRegion.isEnabled) {
              // Si el matchedRegion tiene isEnabled en false, mostrar un mensaje de error y no continuar.
              Swal.fire({
                  icon: 'error',
                  title: 'Acción Prohibida',
                  text: 'La región seleccionada está deshabilitada y no puede ser confirmada.'
              });
              return; // Esto termina la función aquí y no ejecutará el código que sigue.
          }

          // Preguntar si realmente desea confirmar la selección
          Swal.fire({
              title: '¿Estás seguro?',
              text: `Estás a punto de confirmar la selección de ${matchedRegion.regionName}. ¿Deseas continuar?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, confirmar',
              cancelButtonText: 'Cancelar'
          }).then((result) => {
              if (result.isConfirmed) {
                $('#env-and-infra-tab').tab('show');

              }
          });

          // Otras acciones que desees realizar después de confirmar la selección

      } else {
          // Mostrar un mensaje si no hay ninguna región seleccionada
          Swal.fire({
              icon: 'warning',
              title: 'Sin Selección',
              text: 'Por favor, selecciona una región antes de confirmar.'
          });
      }
  });
});
