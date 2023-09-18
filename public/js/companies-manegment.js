// $(document).ready(function () {
//   NewCompanies.getEntitites().done(function (data) {
//     if (data.code == "OK") {
//       var companias = data.object;
//       var companyList = document.getElementById("company-list");

//       for (var i = 0; i < companias.length; i++) {
//         var company= companias[i];

//         // Crear un nuevo elemento de lista
//         var listItem = document.createElement("li");
//         listItem.className = "list-group-item d-flex justify-content-between align-items-center";
//         listItem.id = "company" + (i + 1);
//         listItem.textContent = company.identifier;

//         // Agregar el elemento de lista a la lista
//         companyList.appendChild(listItem);
//       }
//     }
//   });
// });

$(document).ready(function () {
  // Recupera el companyName seleccionado del almacenamiento local
  const selectedCompanyName = localStorage.getItem('selectedCompanyName');

  // Llama a la función para obtener y mostrar las compañías
  obtenerYMostrarCompanies(selectedCompanyName);



  // Función para obtener y mostrar las compañías
  function obtenerYMostrarCompanies(selectedCompanyName) {
    // Realiza una solicitud AJAX para obtener los datos de las compañías
    $.ajax({
      url: '/newentities/obtenerCompanies', // Reemplaza con la ruta correcta en tu servidor
      type: 'GET',
      success: function (data) {
        if (data.code == "OK") {
          const companies = data.object; // Define la variable companies en este alcance
          var companyList = document.getElementById("company-list");

          // Filtra las compañías que coinciden con el companyName seleccionado
          const companiesConNombre = obtenerCompanies(selectedCompanyName, companies);

          // Limpia la lista de compañías
          companyList.innerHTML = "";

          for (var i = 0; i < companiesConNombre.length; i++) {
            var company = companiesConNombre[i];

            // Crea un nuevo elemento de lista
            var listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.id = "company" + (i + 1);
            listItem.textContent = company.identifier;

            // Agrega el elemento de lista a la lista
            companyList.appendChild(listItem);
          }
        }
      },
      error: function () {
        // Maneja errores de solicitud AJAX
        alert('Hubo un error al obtener los datos de las compañías.');
      }
    });

    // Función para filtrar las compañías que coinciden con el companyName
    function obtenerCompanies(companyName, companies) {
      return companies.filter(function (company) {
        return company.Company === companyName;
      });
    }
  }
});

$(document).ready(function () {
  // Recupera el companyName seleccionado del almacenamiento local
  const selectedCompanyName = localStorage.getItem('selectedCompanyName');

  // Llama a la función para obtener y mostrar la información de la compañía seleccionada
  obtenerYMostrarCompany(selectedCompanyName);

  function obtenerYMostrarCompany(selectedCompanyName) {
    $.ajax({
        url: '/newentities/obtenerEntidades',
        type: 'GET',
        success: function (data) {
            if (data.code == "OK") {
                const entidadess = data.object;

                // Actualizar la tarjeta con la entidad seleccionada
                const selectedEntity = entidadess.find(entidades => entidades.companyName === selectedCompanyName);
                if (selectedEntity) {
                    actualizarTarjeta(selectedEntity);
                }
            }
        },
        error: function () {
            alert('Hubo un error al obtener los datos de las entidades.');  // Actualizado el mensaje de error
        }
    });
}

  function actualizarTarjeta(entidades) {
   //actualizar el logo de la entidad
    $(".card-img-top.current-company").attr("src", entidades.flag);
    //ACTUALIZAR EL NOMBRE DE LA ENTIDAD
    $("#company-name").text(entidades.companyName);

  }
});


$(document).ready(function () {

  // Función para crear el modal de agregar compañía
  function crearModalAgregarCompania() {
      // Estructura básica del modal
      let modalHTML = `
          <div class="modal fade" id="modalAgregarCompania" tabindex="-1" aria-labelledby="modalAgregarCompaniaLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="modalAgregarCompaniaLabel">Agregar Nueva Compañía</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <form id="formAgregarCompania">
                              <div class="mb-3">
                                  <label for="companyName" class="form-label">Nombre de la Compañía</label>
                                  <input type="text" class="form-control" id="companyName" required>
                              </div>
                          </form>
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                          <button type="submit" form="formAgregarCompania" class="btn btn-primary">Guardar</button>
                      </div>
                  </div>
              </div>
          </div>
      `;

      // Agregamos el modal al cuerpo del documento
      $('body').append(modalHTML);

      // Evento cuando se envía el formulario del modal
      $('#formAgregarCompania').on('submit', function (e) {
          e.preventDefault();

          // Aquí puedes agregar el código para manejar la información del formulario,
          // por ejemplo, hacer una solicitud AJAX al servidor para guardar la nueva compañía

          const companyName = $('#companyName').val();
          console.log('Nombre de la compañía a guardar:', companyName);

          // Después de manejar el formulario, cierra el modal
          var modalAgregarCompania = new bootstrap.Modal(document.getElementById('modalAgregarCompania'));
          modalAgregarCompania.hide();
      });
  }

  // Invocamos la función para crear el modal
  crearModalAgregarCompania();

  // Evento para abrir el modal cuando se haga clic en el botón de "Agregar Nueva Compañía"
  $('#agregarCompania').click(function () {
      var modalAgregarCompania = new bootstrap.Modal(document.getElementById('modalAgregarCompania'));
      modalAgregarCompania.show();
  });

  // Aquí puedes continuar con el resto del código que maneja las empresas...
  // Por ejemplo, el código que maneja obtenerYMostrarCompanies...
});
