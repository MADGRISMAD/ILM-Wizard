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
    $(".card-img-top").attr("src", entidades.flag);
    //ACTUALIZAR EL NOMBRE DE LA ENTIDAD
    $("#company-name").text(entidades.companyName);

  }
});
