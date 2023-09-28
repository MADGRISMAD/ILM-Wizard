var entidades = [];
let matchedEntity = null;

$(document).ready(function() {
  NewEntities.getEntitites().done(function(data) {
      var cardRow = document.querySelector("#card-container .row");

      if (data.code == "OK") {
          entidades = data.object;

          if (entidades.length === 0) {
              var jumbotronDiv = document.createElement("div");
              jumbotronDiv.className = "jumbotron";
              jumbotronDiv.innerHTML = `
                <h1 class="display-4">No hay entidades disponibles</h1>
                <p class="lead">Por favor, agrega nuevas entidades para visualizarlas aquí.</p>
            `;

              cardRow.appendChild(jumbotronDiv);
          } else {
              for (var i = 0; i < entidades.length; i++) {
                  var entidad = entidades[i];
                  var style = entidad.isEnabled ? "" : "filter: grayscale(100%);";  // Si está desactivado, aplicar filtro gris
                  var notaDesactivado = entidad.isEnabled ? "" : "<p class='text-center text-muted'>Desactivado</p>";

                  var cardDiv = document.createElement("div");
                  cardDiv.className = "col-2 mx-auto";
                  cardDiv.innerHTML = `
                    <div id="card-${entidad.identifier}" class="card" style="width: 100%;" onclick="test('${entidad.identifier}')">
                        <img src="${entidad.flag}" class="card-img-top img-fluid" style="${style}" alt="...">
                        <div class="card-body py-2">
                            <h3 class="card-title text-center mb-2" id="country${i}">${entidad.companyName}</h3>
                            ${notaDesactivado}
                        </div>
                    </div>
                `;

                  cardRow.appendChild(cardDiv);
              }
          }
      } else {
          // Aquí puedes manejar el caso en el que data.code no sea "OK", por ejemplo, mostrando un mensaje de error.
      }
  });
});


//agregar entidad

$(document).ready(function() {

    // Agregar evento de clic al botón
    $("#agregarEntidad").click(function() {
        // Genera los campos de entrada dinámicamente en el modal
        const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Agregar Nueva Entidad</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <form id="entidadForm">
                  <div class="form-group">
                      <label for="identifier">Identificador:</label>
                      <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador">
                  </div>
                  <div class="form-group">
                      <label for="companyName">Nombre de la Compañía:</label>
                      <input type="text" class="form-control" id="companyNameInput" placeholder="Ingrese nombre de la compañía">
                  </div>
                  <div class="form-group">
                      <label for="description">Descripción:</label>
                      <input type="text" class="form-control" id="descriptionInput" placeholder="Ingrese descripción">
                  </div>
                  <div class="form-group">
                      <label for="flag">Bandera:</label>
                      <select class="form-control" id="flagInput">
                         <option value="assets/img/MEXICO.jpg">MX</option>
                          <option value="assets/img/Usa.jpg">USA</option>
                      </select>
                  </div>
                  <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="isEnabledInput">
                      <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                  </div>
              </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-outline-primary" id="guardarEntidad">Aceptar</button>
          </div>
      `;

        // Agrega el contenido al modal
        $("#exampleModal .modal-content").html(modalContent);

        // Abre el modal
        $("#exampleModal").modal("show");
    });

    // Agregar evento de clic al botón "Aceptar" dentro del modal
    $("#exampleModal").on("click", "#guardarEntidad", function() {
        const identifier = $("#identifierInput").val().trim();
        const companyName = $("#companyNameInput").val().trim();
        const description = $("#descriptionInput").val().trim();
        const flag = $("#flagInput").val();
        const isEnabled = $("#isEnabledInput").prop("checked");

        // Removemos la clase de error previamente añadida
        $("#identifierInput, #companyNameInput, #descriptionInput, #flagInput").removeClass("error-input");

        let allFieldsFilled = true;

        if (!identifier) {
            $("#identifierInput").addClass("error-input");
            allFieldsFilled = false;
        }
        if (!companyName) {
            $("#companyNameInput").addClass("error-input");
            allFieldsFilled = false;
        }
        if (!description) {
            $("#descriptionInput").addClass("error-input");
            allFieldsFilled = false;
        }
        if (!flag) {
            $("#flagInput").addClass("error-input");
            allFieldsFilled = false;
        }

        if (!allFieldsFilled) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, completa todos los campos.',
            });
            return;
        }

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se agregará la nueva entidad con los datos proporcionados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, agregar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Crea un objeto entidad con los datos
                const nuevaEntidad = {
                    identifier,
                    companyName,
                    description,
                    isEnabled,
                    flag,
                };

                // Envía los datos al controlador en "controller" mediante una solicitud AJAX
                $.ajax({
                    url: "/newentities/guardarEntidades",
                    type: "POST",
                    dataType: "json",
                    data: nuevaEntidad,
                    success: function(response) {
                        if (response.code === "OK") {
                            console.log("Datos enviados con éxito al controlador", response);
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: 'Los datos se han guardado con éxito',
                            });
                            // Cierra el modal
                            $("#exampleModal").modal("hide");
                            location.reload();
                        } else {
                            // Manejo de otros códigos de respuesta, si los hay en el futuro.
                            console.log("Respuesta inesperada del servidor:", response);
                        }
                    },
                    error: function(error) {
                        // Aquí manejamos la respuesta con código 409 para la entidad duplicada.
                        if (error.status === 409) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Advertencia',
                                text: 'La entidad con ese identificador ya existe.',
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: 'Error al enviar datos al controlador.',
                            });
                        }
                    },
                });



            }
        });

    });

});



function test(tagId) {

    // 1. Remove 'selected' class from all cards
    $('.card').removeClass('selected');

    // 2. Find entity object by tagId
    matchedEntity = entidades.find(entity => entity.identifier === tagId);

    // 3. Check if entity was found
    if (matchedEntity) {
        // 4. Add 'selected' class to the card
        $(`#card-${tagId}`).addClass('selected');
        console.log("entidad encontrada", matchedEntity);

    } else {
        console.log("entidad no encontrada");
    }

}

//----confirm entity----------------
$(document).ready(function () {
  // ... (tu código existente para la selección de tarjetas)

  // Agregar un evento de clic al botón de confirmación
  $("#confirmarSeleccion").click(function() {
      if (matchedEntity) {
          if (!matchedEntity.isEnabled) {
              // Si el matchedEntity tiene isEnabled en false, mostrar un mensaje de error y no continuar.
              Swal.fire({
                  icon: 'error',
                  title: 'Acción Prohibida',
                  text: 'La entidad seleccionada está deshabilitada y no puede ser confirmada.'
              });
              return; // Esto termina la función aquí y no ejecutará el código que sigue.
          }

          // Preguntar si realmente desea confirmar la selección
          Swal.fire({
              title: '¿Estás seguro?',
              text: `Estás a punto de confirmar la selección de ${matchedEntity.companyName}. ¿Deseas continuar?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, confirmar',
              cancelButtonText: 'Cancelar'
          }).then((result) => {
            $('#company-tab').tab('show');
          });

          // Otras acciones que desees realizar después de confirmar la selección

      } else {
          // Mostrar un mensaje si no hay ninguna tarjeta seleccionada
          Swal.fire({
              icon: 'warning',
              title: 'Sin Selección',
              text: 'Por favor, selecciona una tarjeta antes de confirmar.'
          });
      }
  });
});





//----edit entity----------------
$(document).ready(function() {

    function showModalContent(editEntity) {
        const isEditing = editEntity !== undefined;
        const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title" id="entityModalLabel">${isEditing ? 'Editar Entidad ' + matchedEntity.identifier: 'Agregar Nueva Entidad'}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <form id="entidadForm">
              <div class="form-group">
              <label for="identifier">Identificador:</label>
              <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador" value="${isEditing ? editEntity.identifier : ''}" ${isEditing ? 'disabled' : ''}>
          </div>
          <div class="form-group">
              <label for="companyName">Nombre de la Compañía:</label>
              <input type="text" class="form-control" id="companyNameInput" placeholder="Ingrese nombre de la compañía" value="${isEditing ? editEntity.companyName : ''}" ${isEditing ? 'disabled' : ''}>
          </div>
                  <div class="form-group">
                      <label for="description">Descripción:</label>
                      <input type="text" class="form-control" id="descriptionInput" placeholder="Ingrese descripción" value="${isEditing ? editEntity.description : ''}">
                  </div>
                  <div class="form-group">
                      <label for="flag">Bandera:</label>
                      <select class="form-control" id="flagInput">
            <option value="assets/img/MEXICO.jpg" ${isEditing && editEntity.flag === "assets/img/MEXICO.jpg" ? 'selected' : ''}>MX</option>
            <option value="assets/img/Usa.jpg" ${isEditing && editEntity.flag === "assets/img/Usa.jpg" ? 'selected' : ''}>USA</option>
        </select>
                  </div>
                  <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${isEditing && editEntity.isEnabled ? 'checked' : ''}>
                      <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                  </div>
              </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-outline-primary" id="guardarEntidad">${isEditing ? 'Actualizar' : 'Aceptar'}</button>
          </div>
      `;

        $("#entityModal .modal-content").html(modalContent);
        $("#entityModal").modal("show");
    }

    $("#editarEntidad").click(function() {
        if (!matchedEntity) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, selecciona una tarjeta antes de continuar.',
            });
            return;
        }
        showModalContent(matchedEntity); // Mostrar modal para editar
    });

    function hasChanges(editedEntity, originalEntity) {
      return editedEntity.description !== originalEntity.description ||
             editedEntity.flag !== originalEntity.flag ||
             editedEntity.isEnabled !== originalEntity.isEnabled;

  }

    $("#entityModal").on("click", "#guardarEntidad", function() {
        const identifier = $("#identifierInput").val().trim();
        const companyName = $("#companyNameInput").val().trim();
        const description = $("#descriptionInput").val().trim();
        const flag = $("#flagInput").val();
        const isEnabled = $("#isEnabledInput").prop("checked");

        if (!matchedEntity) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor, selecciona una tarjeta antes de continuar.',
            });
            return;
        }

        const entidadActualizada = {
            identifier,
            companyName,
            description,
            isEnabled,
            flag,
        };
        if (hasChanges(entidadActualizada, matchedEntity)) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Se actualizará la entidad con los datos proporcionados.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
              updateEntity(entidadActualizada);
            }
        });
      } else {
        updateEntity(entidadActualizada);
      }
    });
    function updateEntity(entidadActualizada) {
          $.ajax({
            url: `/newentities/editarEntidades`,
            type: "PUT",
            dataType: "json",
            data: entidadActualizada,
            success: function(response) {
                if (response && response.code === "OK") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'La entidad ha sido actualizada con éxito',
                    });

                    // Cierra el modal
                    $("#entityModal").modal("hide");
                    location.reload();
                } else {
                    // Manejo de error basado en la respuesta del servidor
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Hubo un error al actualizar la entidad.',
                    });
                }
            },
            error: function(error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error al enviar datos al controlador.',
                });
            },
        });

        };
    });




//----delete entity----------------

$(document).ready(function() {
  $("#eliminarEntidad").click(function() {
      if (!matchedEntity) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una tarjeta antes de continuar.',
          });
          return;
      }

      Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Realmente deseas eliminar esta entidad?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              removeEntity(matchedEntity);
          }
      });
  });

  function removeEntity(entity) {
      // Encuentra el índice de la entidad en el arreglo de entidades
      const index = entidades.findIndex(e => e.identifier === entity.identifier);

      // Si se encuentra, elimina del arreglo
      if (index !== -1) {
          entidades.splice(index, 1);

          $.ajax({
              url: `/newentities/eliminarEntidad`,
              type: "DELETE",
              dataType: "json",
              data: entity,
              success: function(response) {
                  if (response && response.code === "OK") {
                      Swal.fire({
                          icon: 'success',
                          title: 'Éxito',
                          text: 'La entidad ha sido eliminada con éxito',
                      });

                      // Opcional: actualiza la interfaz para reflejar la eliminación
                      location.reload();
                  } else {
                      Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: response.message || 'Error al eliminar la entidad.',
                      });
                  }
              },
              error: function() {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Hubo un error al eliminar la entidad.',
                  });
              }
          });
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo encontrar la entidad.',
          });
      }
  }
});
