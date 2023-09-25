var companies = [];  // Cambio el nombre para evitar confusiones.
let matchedCompany = null;


$(document).ready(function () {
  var companyList = document.getElementById("company-list");

    $("#confirmarSeleccion").click(function() {
        companyList.innerHTML = "";  // Limpia la lista de compañías
        if (matchedEntity) {
            obtenerYMostrarCompanies(matchedEntity.companyName);
        }
    });


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
            listItem.id = "company" + company.identifier;
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


function selectCompany(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#company-list li').removeClass('selected');

  // 2. Extract identifier from tagId
  const companyId = tagId.replace('company', '');

  // 3. Realizar una solicitud AJAX para obtener los datos de la compañía por su identificador
  $.ajax({
    url: '/newentities/obtenerCompanyPorId',  // Ruta del servidor donde se obtiene la compañía por ID
    type: 'GET',
    data: { identifier: companyId },  // Enviar el identificador como parámetro
    success: function(data) {
      if (data.code == "OK") {
        matchedCompany = data.object;

        if (matchedCompany) {
          // 4. Add 'selected' class to the list item
          $(`#${tagId}`).addClass('selected');
          console.log("compañía encontrada", matchedCompany);
        } else {
          console.log("compañía no encontrada en la base de datos");
          console.log("ID buscado:", companyId);
        }

      } else {
        console.log("Error al obtener la compañía:", data.message);
      }
    },
    error: function() {
      console.log("Error al realizar la petición AJAX para obtener la compañía");
    }
  });
}
$(document).on('click', '#company-list li', function() {
  selectCompany(this.id);
});




// update the entity card
$(document).ready(function () {
  $("#confirmarSeleccion").click(function() {
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
      const nameElement = $("#company-name");
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
    // Una función para validar campos de entrada
    function validarCampo(campoId) {
        const valor = $(campoId).val().trim();
        if (valor === "") {
            $(campoId).addClass('is-invalid'); // Marca el campo como inválido
            return false;
        } else {
            $(campoId).removeClass('is-invalid'); // Si es válido, quita la marca de inválido
            return valor;
        }
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

    if (!(identifier && company && hostnamePrefix && regionClientCode && delivery && vdc && cmdbCompany && select && shortName && nicName && region)) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos o Inválidos',
            text: 'Por favor, completa y corrige todos los campos resaltados.',
        });
        return;
    }

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
            "identifier": identifier,
            "Company": company,
            "Hostname prefix": hostnamePrefix,
            "Region or client code": regionClientCode,
            "Delivery": delivery,
            "VDC": vdc,
            "CMDB company": cmdbCompany,
            "isEnabled": isEnabled,
            "select": select,
            "short_name": shortName,
            "nicName": nicName,
            "region": region
        };

            $.ajax({
                url: "/newentities/guardarCompanies",
                type: "POST",
                dataType: "json",
                data: nuevaCompania,
                success: function (response) {
                    if (response.code === "OK") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: 'Los datos de la compañía se han guardado con éxito',
                        });
                        $("#companyModal").modal("hide");
                        // location.reload();
                        $('#company-tab').tab('show');
                        obtenerCompanies();
                    } else {
                        console.log("Respuesta inesperada del servidor:", response);
                    }
                },
                error: function (error) {
                    if (error.status === 409) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Advertencia',
                            text: 'La compañía con ese identificador o nombre ya existe.',
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error al enviar datos de la compañía al controlador.',
                        });
                    }
                },
            });
        }
    });
});
});


//modal para editar compañia
$(document).ready(function() {


  function showCompanyModalContent(editCompany) {
      const isEditing = editCompany !== undefined;

      const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title">${isEditing ? 'Editar Compañía ' + editCompany.identifier : 'Agregar Nueva Compañía'}</h5>
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
                          <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador" value="${isEditing ? editCompany.identifier : ''}">
                      </div>
                      <div class="form-group">
                          <label for="companyInput">Compañía:</label>
                          <input type="text" class="form-control" id="companyInput" placeholder="Ingrese nombre de la compañía" value="${isEditing ? editCompany.company : ''}">
                      </div>
                      <div class="form-group">
                          <label for="hostnamePrefixInput">Hostname prefix:</label>
                          <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Ingrese hostname prefix" value="${isEditing ? editCompany.hostnamePrefix : ''}">
                      </div>
                      <div class="form-group">
                          <label for="regionClientCodeInput">Region or client code:</label>
                          <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Ingrese region or client code" value="${isEditing ? editCompany.regionClientCode : ''}">
                      </div>
                      <div class="form-group">
                          <label for="deliveryInput">Delivery:</label>
                          <input type="text" class="form-control" id="deliveryInput" placeholder="Ingrese delivery" value="${isEditing ? editCompany.Delivery : ''}">
                      </div>
                      <div class="form-group">
                          <label for="vdcInput">VDC:</label>
                          <input type="text" class="form-control" id="vdcInput" placeholder="Ingrese VDC" value="${isEditing ? editCompany.VDC : ''}">
                      </div>
                  </div>
                  <div class="col-md-6"> <!-- Segunda columna -->
                      <div class="form-group">
                          <label for="cmdbCompanyInput">CMDB company:</label>
                          <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Ingrese CMDB company" value="${isEditing ? editCompany.cmdbCompany : ''}">
                      </div>
                      <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${isEditing && editCompany.isEnabled ? 'checked' : ''}>
                          <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                      </div>
                      <div class="form-group">
                          <label for="selectInput">Select:</label>
                          <input type="text" class="form-control" id="selectInput" placeholder="Ingrese select" value="${isEditing ? editCompany.select : ''}">
                      </div>
                      <div class="form-group">
                          <label for="shortNameInput">Short name:</label>
                          <input type="text" class="form-control" id="shortNameInput" placeholder="Ingrese short name" value="${isEditing ? editCompany.shortName : ''}">
                      </div>
                      <div class="form-group">
                          <label for="nicNameInput">Nic Name:</label>
                          <input type="text" class="form-control" id="nicNameInput" placeholder="Ingrese Nic Name" value="${isEditing ? editCompany.nicName : ''}">
                      </div>
                      <div class="form-group">
                          <label for="regionInput">Region:</label>
                          <input type="text" class="form-control" id="regionInput" placeholder="Ingrese region" value="${isEditing ? editCompany.region : ''}">
                      </div>
                  </div>
              </div>
          </form>
      </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-outline-primary" id="guardarCompania">${isEditing ? 'Actualizar' : 'Aceptar'}</button>
        </div>
      `;

      $("#companyModal .modal-content").html(modalContent);
      $("#companyModal").modal("show");
  }

  $("#editarCompany").click(function() {
      if (!matchedCompany) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una compañía antes de continuar.',
          });
          return;
      }
      showCompanyModalContent(matchedCompany); // Mostrar modal para editar
  });

  $("#companyModal").on("click", "#guardarCompania", function() {


      const identifier = $("#identifierInput").val().trim();
      const companyName = $("#companyInput").val().trim();
      const hostnamePrefix = $("#hostnamePrefixInput").val().trim();
      const regionClientCode = $("#regionClientCodeInput").val().trim();
      const delivery = $("#deliveryInput").val().trim();
      const vdc = $("#vdcInput").val().trim();
      const cmdbCompany = $("#cmdbCompanyInput").val().trim();
      const isEnabled = $("#isEnabledInput").is(":checked");
      const select = $("#selectInput").val().trim();
      const shortName = $("#shortNameInput").val().trim();
      const nicName = $("#nicNameInput").val().trim();
      const region = $("#regionInput").val().trim();




      const companyActualizada = {
        identifier,
        Company: companyName,
        "Hostname prefix": hostnamePrefix,
        "Region or client code": regionClientCode,
        Delivery: delivery,
        VDC: vdc,
        "CMDB company": cmdbCompany,
        isEnabled: isEnabled,
        Select: select,
        "short_name": shortName,
        nicName: nicName,
        region: region
      };

      $.ajax({
        url: '/newentities/editarCompanies', // Debes cambiar esto por la ruta correspondiente
        type: 'POST',
        data: companyActualizada,
        success: function(response) {
            if (response.code === "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Compañía guardada con éxito',
                    showConfirmButton: false,
                    timer: 1500
                });
                $("#companyModal").modal("hide");
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar la compañía',
                    text: response.message
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Error de servidor',
                text: 'No se pudo guardar la compañía. Inténtalo de nuevo más tarde.'
            });
        }
    });


  });



});
