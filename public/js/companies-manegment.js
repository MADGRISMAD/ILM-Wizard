$(document).ready(function () {
  // Recupera el companyName seleccionado del almacenamiento local
  const selectedCompanyName = localStorage.getItem('selectedCompanyName');
  var companyList = document.getElementById("company-list");

  // Limpia la lista de compañías
  companyList.innerHTML = "";

  // Si existe un companyName seleccionado, muestra las compañías
  if (selectedCompanyName) {
      obtenerYMostrarCompanies(selectedCompanyName);
  }

  function obtenerYMostrarCompanies(selectedCompanyName) {
    // Realiza una solicitud AJAX para obtener los datos de las compañías
    $.ajax({
      url: '/newentities/obtenerCompanies',
      type: 'GET',
      success: function (data) {
        if (data.code == "OK") {
          const companies = data.object;

          const companiesConNombre = obtenerCompanies(selectedCompanyName, companies);

          for (var i = 0; i < companiesConNombre.length; i++) {
            var company = companiesConNombre[i];

            var listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.id = "company" + (i + 1);
            listItem.textContent = company.identifier;

            companyList.appendChild(listItem);
          }
        }
      },
      error: function () {
        alert('Hubo un error al obtener los datos de las compañías.');
      }
    });

    function obtenerCompanies(companyName, companies) {
      return companies.filter(function (company) {
        return company.Company === companyName;
      });
    }
  }
});


//show the entitys of the company selected

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

//modal para agregar compañia

$(document).ready(function () {

  $("#agregarCompania").click(function () {
    const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">Agregar Nueva Compañía</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="companiaForm">
                    <div class="row">
                        <div class="col-md-6"> <!-- Primera columna -->
                            <div class="form-group">
                                <label for="identifierInput">Identificador:</label>
                                <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador">
                            </div>
                            <div class="form-group">
                                <label for="companyInput">Compañía:</label>
                                <input type="text" class="form-control" id="companyInput" placeholder="Ingrese nombre de la compañía">
                            </div>
                            <div class="form-group">
                                <label for="hostnamePrefixInput">Hostname prefix:</label>
                                <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Ingrese hostname prefix">
                            </div>
                            <div class="form-group">
                                <label for="regionClientCodeInput">Region or client code:</label>
                                <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Ingrese region or client code">
                            </div>
                            <div class="form-group">
                                <label for="deliveryInput">Delivery:</label>
                                <input type="text" class="form-control" id="deliveryInput" placeholder="Ingrese delivery">
                            </div>
                            <div class="form-group">
                                <label for="vdcInput">VDC:</label>
                                <input type="text" class="form-control" id="vdcInput" placeholder="Ingrese VDC">
                            </div>
                        </div>
                        <div class="col-md-6"> <!-- Segunda columna -->
                            <div class="form-group">
                                <label for="cmdbCompanyInput">CMDB company:</label>
                                <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Ingrese CMDB company">
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="isEnabledInput" checked>
                                <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                            </div>
                            <div class="form-group">
                                <label for="selectInput">Select:</label>
                                <input type="text" class="form-control" id="selectInput" placeholder="Ingrese select">
                            </div>
                            <div class="form-group">
                                <label for="shortNameInput">Short name:</label>
                                <input type="text" class="form-control" id="shortNameInput" placeholder="Ingrese short name">
                            </div>
                            <div class="form-group">
                                <label for="nicNameInput">Nic Name:</label>
                                <input type="text" class="form-control" id="nicNameInput" placeholder="Ingrese Nic Name">
                            </div>
                            <div class="form-group">
                                <label for="regionInput">Region:</label>
                                <input type="text" class="form-control" id="regionInput" placeholder="Ingrese region">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-outline-primary" id="guardarCompania">Aceptar</button>
            </div>
        `;


      // Agrega el contenido al modal
      $("#companyModal .modal-content").html(modalContent);
      // Abre el modal
      $("#companyModal").modal("show");
  });

  $("#companyModal").on("click", "#guardarCompania", function () {

      let todosLosCamposSonValidos = true;

      // Una función para validar campos de entrada
      function validarCampo(campoId) {
          const valor = $(campoId).val().trim();
          if (valor === "") {
              todosLosCamposSonValidos = false;
              $(campoId).addClass('is-invalid'); // Marca el campo como inválido
          } else {
              $(campoId).removeClass('is-invalid'); // Si es válido, quita la marca de inválido
          }
          return valor;
      }

      const identifier = validarCampo("#identifierInput");
      const company = validarCampo("#companyInput");
      const hostnamePrefix = validarCampo("#hostnamePrefixInput");
      const regionClientCode = validarCampo("#regionClientCodeInput");
      const delivery = validarCampo("#deliveryInput");
      const vdc = validarCampo("#vdcInput");
      const cmdbCompany = validarCampo("#cmdbCompanyInput");
      const select = validarCampo("#selectInput");
      const shortName = validarCampo("#shortNameInput");
      const nicName = validarCampo("#nicNameInput");
      const region = validarCampo("#regionInput");

      const isEnabled = $("#isEnabledInput").prop("checked");

      if (todosLosCamposSonValidos) {
          Swal.fire({
              title: '¿Estás seguro?',
              text: "Se agregará la nueva compañía con los datos proporcionados.",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, agregar',
              cancelButtonText: 'Cancelar'
          }).then((result) => {
              if (result.isConfirmed) {
                  const nuevaCompania = {
                      identifier,
                      company,
                      hostnamePrefix,
                      regionClientCode,
                      delivery,
                      vdc,
                      cmdbCompany,
                      isEnabled,
                      select,
                      shortName,
                      nicName,
                      region
                  };

                  $.ajax({
                      url: "/newentities/guardarCompanies",
                      type: "POST",
                      dataType: "json",
                      data: nuevaCompania,
                      success: function (response) {
                          console.log("Datos enviados con éxito al controlador", response);
                          Swal.fire({
                              icon: 'success',
                              title: 'Éxito',
                              text: 'Los datos de la compañía se han guardado con éxito',
                          });
                          $("#companyModal").modal("hide");
                      },
                      error: function (error) {
                          Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Error al enviar datos de la compañía al controlador.',
                          });
                      },
                  });
              }
          });
      } else {
          Swal.fire({
              icon: 'warning',
              title: 'Campos Incompletos o Inválidos',
              text: 'Por favor, completa y corrige todos los campos resaltados.',
          });
      }
  });
});
