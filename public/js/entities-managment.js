$(document).ready(function () {
  NewEntities.getEntitites().done(function (data) {
      var cardRow = document.querySelector("#card-container .row");

      if (data.code == "OK") {
          var entidades = data.object;

          // Si no hay entidades para mostrar
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

                  // Crear una nueva tarjeta div
                  var cardDiv = document.createElement("div");
                  cardDiv.className = "col mx-auto";
                  cardDiv.innerHTML = `
                  <div class="card" style="width: 15rem;">
                      <img src="${entidad.flag}" class="card-img-top img-fluid" alt="...">
                      <div class="card-body py-2">
                          <h3 class="card-title text-center mb-2" id="country${i}">${entidad.companyName}</h3>
                      </div>
                  </div>
              `;

                  // Agregar la tarjeta a la fila

                  cardRow.appendChild(cardDiv);
              }
          }
      } else {
          // Aquí puedes manejar el caso en el que data.code no sea "OK", por ejemplo, mostrando un mensaje de error.
      }
  });
});

// ... (Resto de tu código) ...






$(document).ready(function () {
  // Agregar evento de clic al botón
  $("#agregarEntidad").click(function () {
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
  $("#exampleModal").on("click", "#guardarEntidad", function () {
    // Recopila los datos del formulario dentro del modal
    const identifier = $("#identifierInput").val();
    const companyName = $("#companyNameInput").val();
    const description = $("#descriptionInput").val();
    const isEnabled = $("#isEnabledInput").prop("checked");
    const flag = $("#flagInput").val();

    // Verifica que los campos no estén vacíos
    if (identifier && companyName && description && flag) {
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
                    success: function (response) {
                        console.log("Datos enviados con éxito al controlador", response);

                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: 'Los datos se han guardado con éxito',
                        });

                        // Cierra el modal
                        $("#exampleModal").modal("hide");
                        location.reload();
                    },
                    error: function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Error al enviar datos al controlador.',
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

  // Guarda el companyName seleccionado en el almacenamiento local
  localStorage.setItem('selectedCompanyName', companyName);

  // Activa la siguiente pestaña "company"
  $('a[aria-controls="company"]').tab('show');


});
      $('a[aria-controls="current-tab-name"]').on('hide.bs.tab', function (e) {
        localStorage.removeItem('selectedCompanyName');
      });



  function obtenerCompanies(companyName) {
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




$(document).ready(function () {

  function selectCard(card) {
    $('.card').removeClass('selected');
    card.addClass('selected');
    $('h3.card.selected').css('color', 'white');

    // Habilitar o deshabilitar el botón "Eliminar Compañía"
    if (card.hasClass('selected')) {
      $('#eliminarEntidad').prop('disabled', false);
    } else {
      $('#eliminarEntidad').prop('disabled', true);
    }
  }

  $('#eliminarEntidad').click(function () {
    const tarjetaSeleccionada = $('.card.selected');
    if (tarjetaSeleccionada.length === 0) {
      // Muestra un mensaje de error con SweetAlert si no se selecciona nada para eliminar
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Por favor, selecciona una tarjeta antes de continuar.',
      });
      return;
    }

    // Mostrar el cuadro de diálogo de confirmación de SweetAlert2
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
        // Realiza una solicitud AJAX DELETE para eliminar la última entidad
        $.ajax({
          url: '/newentities/eliminarUltimaEntidad', // Esta es la nueva ruta en tu servidor
          type: 'DELETE',
          success: function (response) {
            if (response.code === "OK") {
              // Elimina la tarjeta seleccionada en el cliente
              tarjetaSeleccionada.remove();

              // Desactiva el botón "Eliminar Compañía" después de eliminarla
              $('#eliminarEntidad').prop('disabled', true);

              //resfrescar la pagina para que se actualice la lista de compañias
              location.reload();



              // Muestra un mensaje de éxito con SweetAlert2
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Tu compañía ha sido eliminada.',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              // Muestra un mensaje de error si la eliminación no tiene éxito
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar la compañía.',
              });
            }
          },
          error: function () {
            // Muestra un mensaje de error si hay un error en la solicitud AJAX
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un error al realizar la solicitud.',
            });
          }
        });
      }
    });
  });
});

// $(document).ready(function() {

//   // Crear el modal
//   function crearModal() {
//       var modalContent = `
//           <div class="modal-header">
//               <h5 class="modal-title" id="exampleModalLabel">Agregar Nueva Entidad</h5>
//               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//                   <i class="fas fa-times"></i>
//               </button>
//           </div>
//           <div class="modal-body">
//           <form id="entidadForm">
//                   <div class="form-group">
//                       <label for="identifier">identifier</label>
//                       <input type="text" class="form-control" id="identifierInput" placeholder="Ingrese identificador">
//                   </div>
//                   <div class="form-group">
//                       <label for="companyName">Nombre de la Compañía:</label>
//                       <input type="text" class="form-control" id="companyNameInput" placeholder="Ingrese nombre de la compañía">
//                   </div>
//                   <div class="form-group">
//                       <label for="description">Descripción:</label>
//                       <input type="text" class="form-control" id="descriptionInput" placeholder="Ingrese descripción">
//                   </div>
//                   <div class="form-group">
//                       <label for="flag">Bandera:</label>
//                       <select class="form-control" id="flagInput">
//                          <option value="assets/img/MEXICO.jpg">MX</option>
//                           <option value="assets/img/Usa.jpg">USA</option>
//                       </select>
//                   </div>
//                   <div class="custom-control custom-checkbox">
//                       <input type="checkbox" class="custom-control-input" id="isEnabledInput">
//                       <label class="custom-control-label" for="isEnabledInput">Habilitado</label>
//                   </div>
//               </form>
//           </div>
//           <div class="modal-footer">
//               <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Cerrar</button>
//               <button type="button" class="btn btn-outline-primary" id="guardarEntidad">Aceptar</button>
//           </div>







//       `;

//       var modalHTML = `
//           <div class="modal fade" id="entidadModal" tabindex="-1" role="dialog" aria-labelledby="entidadModalLabel" aria-hidden="true">
//               <div class="modal-dialog" role="document">
//                   <div class="modal-content">${modalContent}</div>
//               </div>
//           </div>
//       `;

//       // Añadirlo al body
//       $('body').append(modalHTML);
//   }

//   // Llamar a la función cuando se carga el documento
//   crearModal();

//   // Abrir el modal para agregar nueva entidad
//   $("#agregarEntidad").click(function() {
//       // Aquí debes definir la lógica para añadir una nueva entidad.
//       // Por ejemplo, limpiar los campos del formulario si los hubiera en el modal, etc.
//       $("#entidadModal").modal('show');
//   });

//   // Editar entidad
//   $("#editarEntidad").click(function() {
//       var tarjetaSeleccionada = $(".card.selected");
//       if (tarjetaSeleccionada.length > 0) {
//           // Aquí debes llenar el modal con los datos de la tarjeta seleccionada.
//           // Por ejemplo, si tu modal tiene un campo de nombre:
//           // $("#nombreInput").val(tarjetaSeleccionada.data("nombre"));
//           $("#entidadModal").modal('show');
//       } else {
//           Swal.fire({
//               icon: 'error',
//               title: 'Oops...',
//               text: 'Por favor, selecciona una tarjeta para editar.',
//           });
//       }
//   });

//   // Guardar cambios realizados en el modal (asumiendo que tienes un botón de guardar en el modal con id "guardarEntidad")
//   $("#guardarEntidad").click(function() {
//       var tarjetaSeleccionada = $(".card.selected");
//       if (tarjetaSeleccionada.length > 0) {
//           // Aquí debes guardar los cambios realizados en el modal a la tarjeta.
//           // Por ejemplo:
//           // tarjetaSeleccionada.data("nombre", $("#nombreInput").val());
//           // Y así sucesivamente para todos los campos.
//           $("#entidadModal").modal('hide');
//       } else {
//           Swal.fire({
//               icon: 'error',
//               title: 'Oops...',
//               text: 'Por favor, selecciona una tarjeta antes de guardar.',
//           });
//       }
//   });

//   // Eliminar compañía
//   $('#eliminarEntidad').click(function() {
//       const tarjetaSeleccionada = $('.card.selected');
//       if (tarjetaSeleccionada.length === 0) {
//           // Muestra un mensaje de error con SweetAlert si no se selecciona nada para eliminar
//           Swal.fire({
//               icon: 'error',
//               title: 'Oops...',
//               text: 'Por favor, selecciona una tarjeta antes de continuar.',
//           });
//           return;
//       }

//       // Mostrar el cuadro de diálogo de confirmación de SweetAlert2
//       Swal.fire({
//           title: '¿Estás seguro?',
//           text: "¡No podrás revertir esto!",
//           icon: 'warning',
//           showCancelButton: true,
//           confirmButtonColor: '#3085d6',
//           cancelButtonColor: '#d33',
//           confirmButtonText: 'Sí, eliminarlo'
//       }).then((result) => {
//           if (result.isConfirmed) {
//               // Aquí mantienes tu código para eliminar la compañía...
//           }
//       });
//   });
// });
