let matchedRegion = null;  // Variable para almacenar la región seleccionada

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
      const imgElement = $(".card-img-top.current-company");
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
      const nameElement = $("#region-nameofentity");
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

                      // Cambiado de region.identifier a region.Region
                      listItem.textContent = region.Region;

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


// confirm region and show next tab
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



//add new region
$(document).ready(function () {

  function isValidInput(value, id) {
    const allowSpacesInMiddle = ["identifier", "Region"];

    // Si el valor tiene espacios al principio o al final, es inválido.
    if (value.trim() !== value) {
        return false;
    }

    // Si el ID no está en la lista que permite espacios en medio pero tiene espacios en medio, es inválido.
    if (!allowSpacesInMiddle.includes(id) && value.includes(" ")) {
        return false;
    }

    return true;
  }

  function validarCampo(campoId) {
    const valor = $(campoId).val();

    if (valor === "" || !isValidInput(valor, campoId.replace("#", ""))) {
        $(campoId).addClass('is-invalid'); // Marca el campo como inválido
        return false;
    } else {
        $(campoId).removeClass('is-invalid'); // Si es válido, quita la marca de inválido
        return valor;
    }
  }

  $("#agregarRegion").click(function () {
    const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">Agregar Nueva Región</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="regionForm">
                    <div class="form-group">
                        <label for="entityIdInput">Entity ID:</label>
                        <input type="text" class="form-control" id="entityIdInput" placeholder="Ingrese ID de la entidad">
                    </div>
                    <div class="form-group">
                        <label for="identifierInput">Identificador:</label>
                        <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador">
                    </div>
                    <div class="form-group">
                        <label for="regionInput">Región:</label>
                        <input type="text" class="form-control" id="regionInput" placeholder="Ingrese nombre de la región">
                    </div>
                    <div class="custom-control custom-checkbox">
                        <input type="checkbox" class="custom-control-input" id="isEnabledInput" checked>
                        <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-outline-primary" id="guardarRegion">Aceptar</button>
            </div>
        `;

    // Agrega el contenido al modal
    $("#RegionModalAdd .modal-content").html(modalContent);
    // Abre el modal
    $("#RegionModalAdd").modal("show");
  });

  $("#RegionModalAdd").on("click", "#guardarRegion", function () {
    const entityId = validarCampo("#entityIdInput");
    const identifier = validarCampo("#identifierInput");
    const region = validarCampo("#regionInput");
    const isEnabled = $("#isEnabledInput").prop("checked");

    if (!(entityId && identifier && region)) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos o Inválidos',
            text: 'Por favor, completa y corrige todos los campos resaltados.',
        });
        return;
    }

    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se agregará la nueva región con los datos proporcionados.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, agregar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
          const nuevaRegion = {
            "entity_id": entityId,
            "identifier": identifier,
            "Region": region,
            "isEnabled": isEnabled
          };

          $.ajax({
              url: "/newentities/guardarRegions",
              type: "POST",
              dataType: "json",
              data: nuevaRegion,
              success: function (response) {
                  if (response.code === "OK") {
                      Swal.fire({
                          icon: 'success',
                          title: 'Éxito',
                          text: 'Los datos de la región se han guardado con éxito',
                      });
                      $("#RegionModalAdd").modal("hide");

                  } else {
                      console.log("Respuesta inesperada del servidor:", response);
                  }
              },
              error: function (error) {
                  if (error.status === 409) {
                      Swal.fire({
                          icon: 'warning',
                          title: 'Advertencia',
                          text: 'La región con ese identificador o nombre ya existe.',
                      });
                  } else {
                      Swal.fire({
                          icon: 'error',
                          title: 'Oops...',
                          text: 'Error al enviar datos de la región al controlador.',
                      });
                  }
              },


          });
        }
    });
  });
});

//edit region
$(document).ready(function () {

  function showRegionModalContent(editRegion) {
    const isEditing = editRegion !== undefined;

    const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${isEditing ? 'Editar Región ' + editRegion.identifier : 'Agregar Nueva Región'}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="modal-body">
        <form id="regionForm">
            <div class="form-group">
                <label for="identifierInput">Identificador:</label>
                <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador" value="${isEditing ? editRegion.identifier : ''}" ${isEditing ? 'readonly' : ''}>
            </div>
            <div class="form-group">
                <label for="regionInput">Región:</label>
                <input type="text" class="form-control" id="regionInput" placeholder="Ingrese nombre de la región" value="${isEditing ? editRegion.Region : ''}">
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${isEditing && editRegion.isEnabled ? 'checked' : ''}>
                <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
            </div>
        </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-outline-primary" id="editedRegion">${isEditing ? 'Actualizar' : 'Aceptar'}</button>
      </div>
    `;

    // Ajuste del ID del modal para editar regiones
    $("#RegionModalEdit .modal-content").html(modalContent);
    $("#RegionModalEdit").modal("show");
  }

  $("#editarRegion").click(function () {
    if (!matchedRegion) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor, selecciona una región antes de continuar.',
        });
        return;
    }
    showRegionModalContent(matchedRegion);
  });

  function hasChanges(editedRegion, originalRegion) {
    return editedRegion.identifier !== originalRegion.identifier ||
           editedRegion.Region !== originalRegion.Region ||
           editedRegion.isEnabled !== originalRegion.isEnabled;
  }

  $("#RegionModalEdit").on("click", "#editedRegion", function () {
    const identifier = $("#identifierInput").val().trim();
    const region = $("#regionInput").val().trim();
    const isEnabled = $("#isEnabledInput").is(":checked");

    const regionActualizada = {
      "entity_id": matchedRegion.entity_id,  // Mantenemos el mismo entity_id
      "identifier": identifier,
      "Region": region,
      "isEnabled": isEnabled
    };

    if (hasChanges(regionActualizada, matchedRegion)) {
      Swal.fire({
          title: '¿Estás seguro?',
          text: "Se actualizará la región con los datos proporcionados.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, actualizar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
            updateRegion(regionActualizada);
          }
      });
    } else {
      updateRegion(regionActualizada);
    }
  });

  function updateRegion(regionActualizada) {
    $.ajax({
        url: '/newentities/editar-regions',
        type: 'PUT',
        data: regionActualizada,
        success: function (response) {
            if (response.code === "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Región actualizada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                $("#RegionModalEdit").modal("hide");
                //recarga la página para que se vea la región actualizada
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la región',
                    text: response.message
                });
            }
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error de servidor',
                text: 'No se pudo actualizar la región. Inténtalo de nuevo más tarde.'
            });
        }
    });
  }
});


//delete region
$(document).ready(function() {
  $("#eliminarRegion").click(function() {
      if (!matchedRegion) { // Supongo que matchedRegion es el objeto que tiene la región seleccionada
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una región antes de continuar.',
          });
          return;
      }

      Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Realmente deseas eliminar esta región?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              deleteRegion(matchedRegion.identifier);
          }
      });
  });

  function deleteRegion(identifier) {
      $.ajax({
          url: `/newentities/eliminarRegion/${identifier}`,  // Suponiendo que envías el identificador en la URL
          type: 'DELETE',
          success: function(response) {
              if (response.code === "OK") {
                  Swal.fire({
                      icon: 'success',
                      title: 'Eliminado con éxito',
                      text: 'La región ha sido eliminada con éxito',
                      showConfirmButton: false,
                      timer: 1500
                  });
                  // Opcional: actualiza la interfaz para reflejar la eliminación
                  location.reload();
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error al eliminar',
                      text: response.message
                  });
              }
          },
          error: function() {
              Swal.fire({
                  icon: 'error',
                  title: 'Error de servidor',
                  text: 'No se pudo eliminar la región. Inténtalo de nuevo más tarde.'
              });
          }
      });
  }
});
