var entidades = [];
let matchedEntity = null;

$(document).ready(function() {
    NewEntities.getEntitites().done(function(data) {
        var cardRow = document.querySelector("#card-container .row");

        if (data.code == "OK") {
            entidades = data.object;

            // Filtramos las entidades que tienen isEnabled en true
            var entidadesHabilitadas = entidades.filter(function(entidad) {
                return entidad.isEnabled;
            });


            if (entidadesHabilitadas.length === 0) {
                var jumbotronDiv = document.createElement("div");
                jumbotronDiv.className = "jumbotron";
                jumbotronDiv.innerHTML = `
                  <h1 class="display-4">No hay entidades disponibles</h1>
                  <p class="lead">Por favor, agrega nuevas entidades para visualizarlas aquí.</p>
              `;

                cardRow.appendChild(jumbotronDiv);
            } else {
                for (var i = 0; i < entidadesHabilitadas.length; i++) {
                    var entidad = entidadesHabilitadas[i];

                    var cardDiv = document.createElement("div");
                    cardDiv.className = "col-2 mx-auto";
                    cardDiv.innerHTML = `
                      <div id="card-${entidad.identifier}" class="card" style="width: 100%;" onclick="test('${entidad.identifier}')">
                          <img src="${entidad.flag}" class="card-img-top img-fluid" alt="...">
                          <div class="card-body py-2">
                              <h3 class="card-title text-center mb-2" id="country${i}">${entidad.companyName}</h3>
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


// $(document).ready(function () {
//   function selectCard(card) {
//     $('.card').removeClass('selected');
//     card.addClass('selected');


//     $('h3 .card.selected').css('color', 'white');
//   }

//   // $('#card-container').on('click', '.card', function () {
//   //   selectCard($(this));
//   // });




// $('#confirmarSeleccion').click(function () {
//   const tarjetaSeleccionada = $('.card.selected');
//   if (tarjetaSeleccionada.length === 0) {
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Por favor, selecciona una tarjeta antes de continuar.',
//     });
//     return;
//   }

//   const companyName = tarjetaSeleccionada.find('.card-title').text();  //crear un filter de las companias para traer las que pertenecen al identificador seleccionado

//   // Guarda el companyName seleccionado en el almacenamiento local
//   localStorage.setItem('selectedCompanyName', companyName);

//   // Activa la siguiente pestaña "company"
//   $('a[aria-controls="company"]').tab('show');


// });
//       $('a[aria-controls="current-tab-name"]').on('hide.bs.tab', function (e) {
//         localStorage.removeItem('selectedCompanyName');
//       });



//   function obtenerCompanies(companyName) {
//     return companies.filter(function (company) {
//       return company.Company === companyName;
//     });
//   }

//   function mostrarCompaniesConNombre(companiesConNombre) {
//     $('#company-list').empty();
//     for (const company of companiesConNombre) {
//       const listItem = $('<li>').text(company.Company);
//       $('#company-list').append(listItem);
//     }
//   }
// });


//----------------delete entity------------------
// function selectCard(card) {
//     card.addClass('selected');
//     card.find('h3').css('color', 'white');

//     // Habilitar o deshabilitar el botón "Eliminar Compañía"
//     if (card.hasClass('selected')) {
//         $('#eliminarEntidad').prop('disabled', false);
//     } else {
//         $('#eliminarEntidad').prop('disabled', true);
//     }
// }

$(document).ready(function() {

    $('#eliminarEntidad').click(function() {
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
            text: "¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminarlo'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                        url: `/newentities/eliminarUltimaEntidad`,
                        type: 'DELETE',
                    })
                    .done(function(response) {
                        if (response && response.code === "OK") {
                            // Elimina la tarjeta seleccionada en el cliente
                            $(`#card-${matchedEntity.identifier}`).remove();
                            $('#eliminarEntidad').prop('disabled', true);


                            entidades = entidades.filter(entity => entity.identifier !== matchedEntity.identifier);

                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: 'Tu compañía ha sido eliminada.',
                                showConfirmButton: false,
                                timer: 1500
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.message || 'Hubo un error al eliminar la compañía.',
                            });
                        }
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error al enviar datos al controlador.',
                        });
                        console.error("Error en la solicitud:", textStatus, errorThrown);
                    });
            }
        });
    });
});

//----edit entity----------------
$(document).ready(function() {

    function showModalContent(editEntity) {
        const isEditing = editEntity !== undefined;
        const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title" id="entityModalLabel">${isEditing ? 'Editar Entidad' : 'Agregar Nueva Entidad'}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <form id="entidadForm">
                  <div class="form-group">
                      <label for="identifier">Identificador:</label>
                      <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador" value="${isEditing ? editEntity.identifier : ''}">
                  </div>
                  <div class="form-group">
                      <label for="companyName">Nombre de la Compañía:</label>
                      <input type="text" class="form-control" id="companyNameInput" placeholder="Ingrese nombre de la compañía" value="${isEditing ? editEntity.companyName : ''}">
                  </div>
                  <div class="form-group">
                      <label for="description">Descripción:</label>
                      <input type="text" class="form-control" id="descriptionInput" placeholder="Ingrese descripción" value="${isEditing ? editEntity.description : ''}">
                  </div>
                  <div class="form-group">
                      <label for="flag">Bandera:</label>
                      <select class="form-control" id="flagInput" value="${isEditing ? editEntity.flag : ''}">
                          <option value="assets/img/MEXICO.jpg">MX</option>
                          <option value="assets/img/Usa.jpg">USA</option>
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
    });

});
