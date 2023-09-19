$(document).ready(function() {

  // Obtiene las entidades y muestra en la tarjeta de entidad seleccionada
  function getAndDisplayEntities() {
      $.ajax({
          url: "/newentities/obtenerEntidades",
          type: "GET",
          dataType: "json",
          success: function(data) {
              if (data.code === "OK") {
                  let selectedEntity = data.object[0];
                  $('.selected-entity').attr('src', selectedEntity.flag);
                  $('#selectedEntityName').text(selectedEntity.companyName);
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Algo salió mal al obtener las entidades!',
                      footer: '<a href>¿Necesitas ayuda?</a>'
                  });
              }
          },
          error: function() {
              Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error en la conexión al intentar obtener las entidades.',
                  footer: '<a href>¿Necesitas ayuda?</a>'
              });
          }
      });
  }

  // Obtiene y muestra la lista de environments
  function getAndDisplayEnvironments() {
      $.ajax({
          url: "/newentities/obtenerEnvironments",
          type: "GET",
          dataType: "json",
          success: function(data) {
              if (data.code === "OK") {
                  let environments = data.object;
                  for (let environment of environments) {
                      $("#environment-list").append(`
                          <li class="list-group-item">
                              <input type="checkbox" checked class="toggle-environment"> ${environment.identifier}
                          </li>`);
                  }
              } else {
                  // Puedes manejar los errores aquí si es necesario
              }
          },
          error: function() {
              // Puedes manejar errores de conexión aquí si es necesario
          }
      });
  }

  // Evento al seleccionar un environment para obtener y mostrar tipos de infraestructura asociados
  $("#environment-list").on("click", "li", function(e) {
      if (!$(this).hasClass("disabled-item")) {
          let selectedEnvironment = $(this).text();
          getAndDisplayInfrastructure(selectedEnvironment);
      }
  });

  // Funcionalidad de click en la casilla de verificación
  $("#environment-list").on("change", ".toggle-environment", function() {
      if ($(this).prop("checked")) {
          $(this).closest("li").removeClass("disabled-item");
      } else {
          $(this).closest("li").addClass("disabled-item");
      }
  });

  // Obtiene y muestra la lista de tipos de infraestructura basado en el environment seleccionado
  function getAndDisplayInfrastructure(selectedEnvironment) {
      // Aquí considero que el selectedEnvironment será usado para filtrar en el backend los resultados.
      // Si es el caso, podrías añadirlo al AJAX request como data. Si no, simplemente ignora este comentario.
      $.ajax({
          url: "/newentities/obtenerInfraestructuras",
          type: "GET",
          dataType: "json",
          success: function(data) {
              if (data.code === "OK") {
                  let infrastructures = data.object;
                  $("#infrastructure-list").empty();
                  for (let infraTypes of infrastructures) {
                      $("#infrastructure-list").append(`<li class="list-group-item">${infraTypes.identifier}</li>`);
                  }
              } else {
                  // Puedes manejar los errores aquí si es necesario
              }
          },
          error: function() {
              // Puedes manejar errores de conexión aquí si es necesario
          }
      });
  }

  // Llamamos a las funciones iniciales
  getAndDisplayEntities();
  getAndDisplayEnvironments();
  getAndDisplayInfrastructure();

});


$(document).ready(function () {

  function generateItemSelectionModal() {
    return `
      <div class="modal-header">
          <h5 class="modal-title">Seleccione Item a Agregar</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="modal-body">
          <button id="btnAddEnvironment" class="btn btn-primary btn-block">Agregar Nuevo Environment</button>
          <button id="btnAddInfrastructure" class="btn btn-primary btn-block">Agregar Nueva Infraestructura</button>
      </div>
    `;
  }

  function generateEnvironmentModalContent() {
    return `
        <div class="modal-header">
            <h5 class="modal-title" id="environmentModalLabel">Agregar Nuevo Environment</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="environmentForm">
                <div class="form-group">
                    <label for="envIdentifier">Identificador:</label>
                    <input type="text" class="form-control" id="envIdentifierInput" placeholder="Ingrese identificador">
                </div>
                <div class="form-group">
                    <label for="envName">Nombre del Environment:</label>
                    <input type="text" class="form-control" id="envNameInput" placeholder="Ingrese nombre del environment">
                </div>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="envIsEnabledInput">
                    <label class="custom-control-label" for="envIsEnabledInput">Habilitado</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-outline-primary" id="guardarEnvironment">Aceptar</button>
        </div>
    `;
  }

  function generateInfrastructureModalContent() {
    return `
        <div class="modal-header">
            <h5 class="modal-title" id="infrastructureModalLabel">Agregar Nueva Infraestructura</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="infrastructureForm">
                <div class="form-group">
                    <label for="infraIdentifier">Identificador:</label>
                    <input type="text" class="form-control" id="infraIdentifierInput" placeholder="Ingrese identificador">
                </div>
                <div class="form-group">
                    <label for="infraName">Nombre de la Infraestructura:</label>
                    <input type="text" class="form-control" id="infraNameInput" placeholder="Ingrese nombre de la infraestructura">
                </div>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="infraIsEnabledInput">
                    <label class="custom-control-label" for="infraIsEnabledInput">Habilitado</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-outline-primary" id="guardarInfrastructure">Aceptar</button>
        </div>
    `;
  }

  function enviarEnvironmentData() {
    const envData = {
      identifier: $('#envIdentifierInput').val(),
      name: $('#envNameInput').val(),
      isEnabled: $('#envIsEnabledInput').prop('checked')
    };

    $.ajax({
      type: "POST",
      url: "/newentities/guardarEnvironments",
      data: envData,
      success: function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Guardado con éxito',
          text: 'Environment guardado correctamente.'
        });
        //mandar mensaje en la consola con el response
        console.log(response);

      },
      error: function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Hubo un error al guardar el Environment. Por favor, inténtalo de nuevo.'
        });
      }
    });
  }

  function enviarInfrastructureData() {
    const infraData = {
      identifier: $('#infraIdentifierInput').val(),
      name: $('#infraNameInput').val(),
      isEnabled: $('#infraIsEnabledInput').prop('checked')
    };

    $.ajax({
      type: "POST",
      url: "/newentities/guardarInfraestructuras",
      data: infraData,
      success: function (response) {
        Swal.fire({
          icon: 'success',
          title: 'Guardado con éxito',
          text: 'Infraestructura guardada correctamente.'
        });
        //mandar mensaje en la consola con el response
        console.log(response);
      },
      error: function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Hubo un error al guardar la Infraestructura. Por favor, inténtalo de nuevo.'
        });
      }
    });
  }

  $("#agregarNuevoItem").click(function () {
    const modalContent = generateItemSelectionModal();
    $("#itemSelectionModal .modal-content").html(modalContent);
    $("#itemSelectionModal").modal("show");
  });

  $("#itemSelectionModal").on("click", "#btnAddEnvironment", function () {
    $("#itemSelectionModal").modal("hide");
    const modalContent = generateEnvironmentModalContent();
    $("#environmentModal .modal-content").html(modalContent);
    $("#environmentModal").modal("show");
  });

  $("#itemSelectionModal").on("click", "#btnAddInfrastructure", function () {
    $("#itemSelectionModal").modal("hide");
    const modalContent = generateInfrastructureModalContent();
    $("#infrastructureModal .modal-content").html(modalContent);
    $("#infrastructureModal").modal("show");
  });

  $("#environmentModal").on("click", "#guardarEnvironment", function () {
    enviarEnvironmentData();
    $("#environmentModal").modal("hide");
  });

  $("#infrastructureModal").on("click", "#guardarInfrastructure", function () {
    enviarInfrastructureData();
    $("#infrastructureModal").modal("hide");
  });

});


$(document).ready(function() {
  //... (tu código existente)

  $("#editarEntidad").click(function() {
      // Obtiene la entidad seleccionada.
      // Aquí asumo que hay checkboxes con una clase "entidadCheckbox" y que el valor del checkbox es el identificador de la entidad.
      const selectedEntities = $(".entidadCheckbox:checked");

      if (selectedEntities.length !== 1) {
          Swal.fire({
              icon: 'warning',
              title: 'Selección inválida',
              text: 'Por favor, selecciona solo una entidad para editar.',
          });
          return;
      }

      const entityIdToEdit = selectedEntities.val(); // Obtiene el identificador de la entidad seleccionada.

      // Aquí, puedes hacer una solicitud AJAX para obtener los datos actuales de la entidad si es necesario
      // y llenar el formulario de edición con esos datos.

      const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title" id="editModalLabel">Editar Entidad</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <form id="editEntidadForm">
                  <div class="form-group">
                      <label for="editIdentifier">Identificador:</label>
                      <input type="text" class="form-control" id="editIdentifierInput" placeholder="Editar identificador" value="${entityIdToEdit}">
                  </div>
                  <!-- Puedes agregar más campos aquí como se requiera -->
              </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
              <button type="button" class="btn btn-outline-primary" id="guardarCambios">Guardar Cambios</button>
          </div>
      `;

      $("#exampleModal .modal-content").html(modalContent);
      $("#exampleModal").modal("show");
  });

  // Cuando se presiona "Guardar Cambios", toma los datos del formulario y realiza una solicitud AJAX para actualizar la entidad.
  $("#exampleModal").on("click", "#guardarCambios", function() {
      const editIdentifier = $("#editIdentifierInput").val();

      // Verifica que el campo no esté vacío
      if (editIdentifier) {
          // Aquí, puedes hacer una solicitud AJAX para actualizar la entidad con los nuevos datos.
          // ...
      } else {
          Swal.fire({
              icon: 'warning',
              title: 'Campo Incompleto',
              text: 'Por favor, completa todos los campos.',
          });
      }
  });
});
