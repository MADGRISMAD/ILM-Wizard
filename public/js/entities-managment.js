

$(document).ready(function () {
  NewEntities.getEntitites().done(function (data) {
    if (data.code == "OK") {
      var entidades = data.object;
      var cardRow = document.querySelector("#card-container .row");

      for (var i = 0; i < entidades.length; i++) {
        var entidad = entidades[i];

        // Crear una nueva tarjeta div
        var cardDiv = document.createElement("div");
        cardDiv.className = "col mx-auto"; // Agrega la clase mx-auto para centrar
        cardDiv.innerHTML = '<div class="card" style="width: 15rem;">' +
                            '<img src="assets/img/MEXICO.jpg" class="card-img-top" alt="...">' +
                            '<div class="card-body">' +
                            '<h3 class="card-title text-center" id="country' + i + '">' + entidad.companyName + '</h3>' +
                            '</div>' +
                            '<div class="mb-5 d-flex justify-content-around"></div>' +
                            '</div>';
4
        // Agregar la tarjeta a la fila
        cardRow.appendChild(cardDiv);
      }
    }
  });
});





$(document).ready(function () {
  // Agregar evento de clic al botón
  $("#agregarEntidad").click(function () {
    // Genera los campos de entrada dinámicamente en el modal
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Agregar Nueva Entidad</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <form id="entidadForm">
                <div class="form-group">
                    <label for="identifier">Identificador:</label>
                    <input type="text" class="form-control" id="identifierInput">
                </div>
                <div class="form-group">
                    <label for="companyName">Nombre de la Compañía:</label>
                    <input type="text" class="form-control" id="companyNameInput">
                </div>
                <div class="form-group">
                    <label for="description">Descripción:</label>
                    <input type="text" class="form-control" id="descriptionInput">
                </div>
                <div class="form-group">
                    <label for="isEnabled">Habilitado:</label>
                    <input type="checkbox" class="form-control" id="isEnabledInput">
                </div>
                <div class="form-group">
                    <label for="flag">Bandera:</label>
                    <input type="text" class="form-control" id="flagInput">
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="button" class="btn btn-primary" id="guardarEntidad">Aceptar</button>
        </div>
    `;

    // Agrega el contenido al modal
    $("#exampleModal .modal-content").html(modalContent);

    // Abre el modal
    $("#exampleModal").modal("show");
  });

  // Agregar evento de clic al botón "Aceptar" dentro del modal
  $("#exampleModal").on("click", "#guardarEntidad", function () {
    // Recopila los datos del formulario dentro del modal
    const identifier = $("#identifierInput").val();
    const companyName = $("#companyNameInput").val();
    const description = $("#descriptionInput").val();
    const isEnabled = $("#isEnabledInput").prop("checked");
    const flag = $("#flagInput").val();

    // Verifica que los campos no estén vacíos
    if (identifier && companyName && description && flag) {
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
        success: function (response) {
          // Maneja la respuesta del controlador si es necesario
          console.log("Datos enviados con éxito al controlador", response);

          // Cierra el modal
          $("#exampleModal").modal("hide");
        },
        error: function (error) {
          // Maneja los errores de la solicitud
          Swal.fire({
            icon: 'success', // Icono de éxito
            title: 'Éxito',
            text: 'Los datos se han guardado con éxito',
          });

          // Muestra una alerta de error
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error al enviar datos al controlador.',
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, completa todos los campos.',
      });
    }
  });
});



$(document).ready(function () {
  function selectCard(card) {
    $('.card').removeClass('selected');
    card.addClass('selected');


    $('h3 .card.selected').css('color', 'white');
  }

  $('#card-container').on('click', '.card', function () {
    selectCard($(this));
  });

  $('#confirmarSeleccion').click(function () {
    const tarjetaSeleccionada = $('.card.selected');
    if (tarjetaSeleccionada.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona una tarjeta antes de continuar.',
      });
      return;
    }

    const companyName = tarjetaSeleccionada.find('.card-title').text();
    const companiesConNombre = obtenerCompaniesConNombre(companyName);
    tarjetaSeleccionada.removeClass('selected');
    mostrarCompaniesConNombre(companiesConNombre);

    // Activa la siguiente pestaña "company"
    $('a[aria-controls="company"]').tab('show');
  });

  function obtenerCompaniesConNombre(companyName) {
    return companies.filter(function (company) {
      return company.Company === companyName;
    });
  }

  function mostrarCompaniesConNombre(companiesConNombre) {
    $('#company-list').empty();
    for (const company of companiesConNombre) {
      const listItem = $('<li>').text(company.Company);
      $('#company-list').append(listItem);
    }
  }
});
