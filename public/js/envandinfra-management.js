var matchedEnvironment;
var matchedInfrastructure;
var envList = document.getElementById("environment-list");
var infraList = document.getElementById("infrastructure-list");

function updateCard(entities) {
  if (!entities.flag) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Entity data is incomplete or invalid.',
    });
    return;
  }

  // Actualiza el logo de la entidad
  const imgElement = $("#infraIMG");
  if (imgElement.length) {
    imgElement.attr("src", entities.flag);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Could not find the element for the image.',
    });
  }

  // Actualiza el nombre de la entidad
  const nameElement = $("#selectedEntityName");
  if (nameElement.length) {
    nameElement.text(entities.companyName);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Could not find the element for the entity name.',
    });
  }

  // Actualiza el nombre de la compañía
  const companyNameElement = $("#company-nameEI");
  if (matchedCompany && matchedCompany.Company) {
    companyNameElement.text(matchedCompany.Company);
  } else {
    companyNameElement.text("Company not selected");
  }
}

function updateEnvironmentStatusE(envId, isEnabled) {
  const url = '/newenvironments/toggleEnvironmentsStatus';
  console.log("Updating environment with ID:", envId, "New status:", isEnabled, "With Parent ID:", matchedRegion._id);

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      _id: envId,
      parent_id: matchedRegion._id,
      isEnabled: isEnabled
    }),
    success: function (response) {
      if (response.code == "OK") {
        Swal.fire({ icon: 'success', title: 'Success', text: 'Environment status updated successfully.' });
        const listItem = $("#environment" + envId);
        listItem.css("background-color", isEnabled ? "#colorForActivated" : "#d3d3d3");
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update the environment status.' });
      }
    },
    error: function () {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'There was an error updating the environment status.' });
    }
  });
}

function displayEnvironmentsFromCatalog() {
  $.ajax({
    url: "/newenvironments/obtenerEnvironments",
    type: "GET",
    dataType: "json",
    success: function (activeData) {
      if (activeData.code !== "OK") {
        return Swal.fire({ icon: 'error', title: 'Server Error', text: activeData.message });
      }

      const activeEnvironments = activeData.object;

      $.ajax({
        url: "/newenvironments/obtenerCatalogoEnviroments",
        type: "GET",
        dataType: "json",
        success: function (data) {
          if (data.code !== "OK") {
            return Swal.fire({ icon: 'error', title: 'Server Error', text: data.message });
          }

          envList.innerHTML = "";
          data.object.forEach(function (env) {
            let listItem = $("<li>").addClass("list-group-item d-flex justify-content-between align-items-center")
              .attr("id", "environment" + env._id);

            let envText = $("<span>").text(env.EnvName);
            listItem.append(envText);

            let isActive = false; // Valor predeterminado
            if (matchedRegion && activeEnvironments) {
              isActive = activeEnvironments.some(activeEnv => activeEnv._id === env._id && activeEnv.parent_id === matchedRegion._id);
            }


            let checkbox = $("<input>").attr("type", "checkbox").prop("checked", isActive);
            checkbox.on("click", function (event) {
              event.preventDefault();
              Swal.fire({
                title: 'Are you sure?',
                text: "You are about to " + (this.checked ? "activate" : "deactivate") + " this environment.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, keep it!'
              }).then((result) => {
                if (result.isConfirmed) {
                  updateEnvironmentStatusE(env._id, !this.checked);
                }
              });
            });

            listItem.append(checkbox);
            $("#environment-list").append(listItem);
          });
        },
        error: function () {
          Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to fetch environments.' });
        }
      });
    },
    error: function () {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to fetch active environments.' });
    }
  });
}

$(document).ready(function () {
  $("#confirmRegionBtn").click(function () {
    if (matchedEntity) {
      updateCard(matchedEntity);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before confirming.',
      });
    }
  });

  displayEnvironmentsFromCatalog();
});





