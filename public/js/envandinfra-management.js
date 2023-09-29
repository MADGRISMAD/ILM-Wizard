var matchedEnvironment;
// Update the entity card
$(document).ready(function () {
  $("#confirmRegionBtn").click(function() {
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

  function updateCard(entities) {
      if (!entities.flag) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Entity data is incomplete or invalid.',
          });
          return;  // Exit the function if the data is invalid
      }

      // Update the entity logo
      const imgElement = $("#infraIMG");
      if (!imgElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Could not find the element for the image.',
          });
          return;  // Exit the function if the element is not found
      }
      imgElement.attr("src", entities.flag);

      // Update the entity name
      const nameElement = $("#selectedEntityName");
      if (!nameElement.length) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Could not find the element for the entity name.',
          });
          return;  // Exit the function if the element is not found
      }
      nameElement.text(entities.companyName);

      // Update the company name
      const companyNameElement = $("#company-nameEI");
      if (matchedCompany && matchedCompany.Company) {
        console.log("Company Found:", matchedCompany.Company); // Esto te mostrará el nombre de la compañía si existe.
        companyNameElement.text(matchedCompany.Company);
    } else {
        console.log("No Company Found"); // Esto te mostrará un mensaje si no se encuentra la compañía.
        companyNameElement.text("Company not selected");
    }

  }
});


///////////////////////////////////////
$(document).ready(function () {
  var envList = document.getElementById("environment-list");

  function displayEnvironments() {
    $.ajax({
      url: "/newenvironments/obtenerEnvironments",
      type: "GET",
      dataType: "json",
      success: function(data) {
        if (data.code === "OK" && Array.isArray(data.object)) {
          envList.innerHTML = "";

          for (var i = 0; i < data.object.length; i++) {
            var env = data.object[i];

            if (matchedRegion && env.regionId === matchedRegion.identifier) {
              var listItem = document.createElement("li");
              listItem.className = "list-group-item d-flex justify-content-between align-items-center";
              listItem.id = "environment" + env.identifier;

              var envText = document.createElement("span");
              envText.textContent = env.EnvName;
              listItem.appendChild(envText);

              if (!env.isEnabled) {
                listItem.style.backgroundColor = "#d3d3d3";
              }

              var checkbox = document.createElement("input");
              checkbox.type = "checkbox";
              checkbox.checked = env.isEnabled;
              updateCheckboxStatus(checkbox, env.isEnabled, env.identifier);

              listItem.appendChild(checkbox);

              envList.appendChild(listItem);
            }
          }
        } else {
          console.error('Unexpected data format:', data);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error on AJAX request:', textStatus, errorThrown);
      }
    });
  }

  function updateCheckboxStatus(checkbox, isEnabled, envId) {
    checkbox.onclick = function(event) {
      event.preventDefault();
      Swal.fire({
        title: 'Are you sure?',
        text: "You are about to " + (this.checked ? "deactivate" : "activate") + " this environment.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, change it!',
        cancelButtonText: 'No, keep it!'
      }).then((result) => {
        if (result.isConfirmed) {
          checkbox.checked = !checkbox.checked;
          updateEnvironmentStatus(envId, checkbox.checked);
        }
      });
    }
  }

  function updateEnvironmentStatus(envId, isEnabled) {
    $.ajax({
      url: '/newenvironments/toggleEnvironmentsStatus',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        identifier: envId,
        isEnabled: isEnabled
      }),
      success: function(response) {
        if (response.code == "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Environment status updated successfully.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to update the environment status. Please try again.'
          });
        }
      },
      error: function() {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'There was an error updating the environment status. Please try again.'
        });
      }
    });
  }

  $("#confirmRegionBtn").click(function() {
    displayEnvironments();
  });
});



//select a environment fronm the list
// Select an environment from the list
function selectEnvironment(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#environment-list li').removeClass('selected');

  // 2. Extract identifier from tagId
  const envId = tagId.replace('environment', '');

  // 3. Make an AJAX request to fetch the environment data by its identifier
  $.ajax({
      url: '/newenvironments/fetchEnvironmentById',  // Server route where the environment is fetched by ID
      type: 'GET',
      data: { identifier: envId },  // Send the identifier as a parameter
      success: function(data) {
          if (data.code == "OK") {
              matchedEnvironment = data.object;

              if (matchedEnvironment) {
                  // 4. Add 'selected' class to the list item
                  $(`#${tagId}`).addClass('selected');
                  console.log("Environment found", matchedEnvironment);
              } else {
                  console.log("Environment not found in the database");
                  console.log("Searched ID:", envId);
              }
          } else {
              console.log("Error fetching the environment:", data.message);
          }
      },
      error: function() {
          console.log("Error making the AJAX request to fetch the environment");
      }
  });
}

// Event listener for click on list items
$(document).on('click', '#environment-list li', function() {
  selectEnvironment(this.id);
});
