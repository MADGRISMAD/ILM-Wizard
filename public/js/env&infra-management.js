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

