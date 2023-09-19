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

    // Agregar evento de clic al botón
    $("#agregarCompania").click(function () {

      // Genera los campos de entrada dinámicamente en el modal
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
                            <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador" value="imx">
                        </div>
                        <div class="form-group">
                            <label for="companyInput">Compañía:</label>
                            <input type="text" class="form-control" id="companyInput" placeholder="Ingrese nombre de la compañía" value="MX">
                        </div>
                        <div class="form-group">
                            <label for="hostnamePrefixInput">Hostname prefix:</label>
                            <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Ingrese hostname prefix" value="mxr">
                        </div>
                        <div class="form-group">
                            <label for="regionClientCodeInput">Region or client code:</label>
                            <input type="text" class="form-control" id="regionClientCodeInput" value="Region 1">
                        </div>
                        <div class="form-group">
                            <label for="deliveryInput">Delivery:</label>
                            <input type="text" class="form-control" id="deliveryInput" value="Delivery 1">
                        </div>
                        <div class="form-group">
                            <label for="vdcInput">VDC:</label>
                            <input type="text" class="form-control" id="vdcInput" value="VDC 1">
                        </div>
                    </div>
                    <div class="col-md-6"> <!-- Segunda columna -->
                        <div class="form-group">
                            <label for="cmdbCompanyInput">CMDB company:</label>
                            <input type="text" class="form-control" id="cmdbCompanyInput" value="CMDB Company 1">
                        </div>
                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="isEnabledInput" checked>
                            <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
                        </div>
                        <div class="form-group">
                            <label for="selectInput">Select:</label>
                            <input type="text" class="form-control" id="selectInput" value="di">
                        </div>
                        <div class="form-group">
                            <label for="shortNameInput">Short name:</label>
                            <input type="text" class="form-control" id="shortNameInput" value="BSMX">
                        </div>
                        <div class="form-group">
                            <label for="nicNameInput">Nic Name:</label>
                            <input type="text" class="form-control" id="nicNameInput" value="nic">
                        </div>
                        <div class="form-group">
                            <label for="regionInput">Region:</label>
                            <input type="text" class="form-control" id="regionInput" value="mx">
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

    // Agregar evento de clic al botón "Aceptar" dentro del modal
    $("#companyModal").on("click", "#guardarCompania", function () {
        // Recopila los datos del formulario dentro del modal
        const identifier = $("#identifierInput").val();
        const company = $("#companyInput").val();
        const hostnamePrefix = $("#hostnamePrefixInput").val();
        const regionClientCode = $("#regionClientCodeInput").val();
        const delivery = $("#deliveryInput").val();
        const vdc = $("#vdcInput").val();
        const cmdbCompany = $("#cmdbCompanyInput").val();
        const isEnabled = $("#isEnabledInput").prop("checked");
        const select = $("#selectInput").val();
        const shortName = $("#shortNameInput").val();
        const nicName = $("#nicNameInput").val();
        const region = $("#regionInput").val();

        // Verifica que los campos no estén vacíos
        if (identifier && company && hostnamePrefix && regionClientCode && delivery && vdc && cmdbCompany && select && shortName && nicName && region) {
            Swal.fire({
                title: '¿Estás seguro?',
                text: "Se agregará la nueva compañía con los datos proporcionados.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, agregar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Crea un objeto de compañía con los datos
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

                    // Envía los datos al controlador mediante una solicitud AJAX
                    $.ajax({
                        url: "/newentities/guardarCompanies",  // Asegúrate de adaptar esta URL
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

                            // Cierra el modal
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
                title: 'Campos Incompletos',
                text: 'Por favor, completa todos los campos.',
            });
        }
    });
});
