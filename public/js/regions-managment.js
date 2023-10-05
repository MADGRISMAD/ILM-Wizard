// Variable to store the selected region
let matchedRegion = null;

// This function is called when the entire document is fully loaded
$(document).ready(function () {

  // Event listener for click event on the "confirmCompanyBtn" button
  $("#confirmCompanyBtn").click(function () {
    // Check if an entity has been matched or selected
    if (matchedEntity) {
      // Update the card's content with the matched entity's data
      updateCard(matchedEntity);
    } else {
      // If no entity is selected, show an error popup using Swal
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before confirming.',
      });
    }
  });

  // Function to update the entity card's content
  function updateCard(entities) {
    // Ensure that the entity data is complete and valid
    if (!entities.flag) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Entity data is incomplete or invalid.',
      });
      return;  // Exit the function if the data is invalid
    }

    // Try to update the entity logo
    const imgElement = $(".card-img-top.current-company");
    if (!imgElement.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not find the element for the image.',
      });
      return;  // Exit the function if the element is not found
    }
    imgElement.attr("src", entities.flag);

    // Try to update the entity name
    const nameElement = $("#region-nameofentity");
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
    const companyNameElement = $("#company-nameR");
    // Check if a company has been matched and has a name
    if (matchedCompany && matchedCompany.Company) {
      companyNameElement.text(matchedCompany.Company);
    } else {
      // If no company is selected, update with default message
      companyNameElement.text("Company not selected");
    }
  }

});


// Initial code is designed to show regions in a list and use checkboxes to enable or disable them.

var regionList = document.getElementById("Region-list");

// When the "confirmCompanyBtn" is clicked, execute the following function:
$("#confirmCompanyBtn").click(function () {
  // Clear any existing regions from the list
  regionList.innerHTML = "";

  // If a company is matched/selected, fetch and display its related regions
  if (matchedCompany) {
    fetchAndDisplayRegions(matchedCompany.entity_id);
  } else {
    // If no company is selected, display an error message
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Please, select a company before proceeding.',
    });
  }
});
// Fetches and displays regions related to the selected entity
function fetchAndDisplayRegions(selectedEntityId) {
  // Make an AJAX request to fetch the region data
  $.ajax({
    url: '/newregions/fetchRegions',
    type: 'GET',
    data: { entity_id: selectedEntityId },
    success: function (data) {
      if (data.code == "OK") {
        const filteredRegions = data.object;
        // Loop through each region and add it to the HTML list
        for (var i = 0; i < filteredRegions.length; i++) {
          var region = filteredRegions[i];

          var listItem = document.createElement("li");
          listItem.className = "list-group-item d-flex justify-content-between align-items-center list-item-centered";
          listItem.id = "region" + region.identifier;

          // Create a span for the region name
          var regionNameSpan = document.createElement("span");
          regionNameSpan.textContent = region.Region;
          listItem.appendChild(regionNameSpan);

          // If the region has isEnabled set to false, shade in gray and append "DISABLED"
          if (!region.isEnabled) {
            listItem.style.backgroundColor = "#d3d3d3"; // light gray
            var disabledText = document.createElement("span");
            disabledText.textContent = "";
            regionNameSpan.appendChild(disabledText);
          }

          // Add a vertical separator
          var separator = document.createElement("div");
          separator.className = "vertical-separator";
          listItem.appendChild(separator);

          // Create a Bootstrap styled checkbox container
          var checkboxContainer = document.createElement("div");
          checkboxContainer.className = "form-check form-check-inline";

          // Add a checkbox with Bootstrap style inside the container
          var checkbox = document.createElement("input");
          checkbox.className = "form-check-input";  // Bootstrap class for checkboxes
          checkbox.type = "checkbox";
          checkbox.id = "checkboxRegion" + region.identifier;

          // Update checkbox status and add click event based on the region's isEnabled property and identifier
          updateCheckboxStatus(checkbox, region.isEnabled, region.identifier);

          checkboxContainer.appendChild(checkbox);
          listItem.appendChild(checkboxContainer);
          regionList.appendChild(listItem);
        }
      }
    },
    error: function () {
      alert('There was an error fetching region data.');
    }
  });
}

// Updates the checkbox status based on the region's isEnabled property and adds an event listener for checkbox clicks
function updateCheckboxStatus(checkbox, isEnabled, regionId) {
  checkbox.checked = isEnabled;
  // When the checkbox is clicked, ask for confirmation and then proceed based on the user's choice
  checkbox.onclick = function (event) {
    // Prevent the checkbox from being immediately toggled
    event.preventDefault();

    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to " + (this.checked ? "deactivate" : "activate") + " this region.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Toggle checkbox state
        this.checked = !this.checked;

        // Call an AJAX function here to update the backend database for this region's status, based on the checkbox's new state
        updateRegionStatus(regionId, this.checked);

        //LIMPIA LA LISTA DE REGIONES
        regionList.innerHTML = "";
        //VUELVE A CARGAR LA LISTA DE REGIONES
        fetchAndDisplayRegions(matchedCompany.entity_id);
      }
    });
  }
}
// Sends an AJAX request to the backend to update the status of a region
function updateRegionStatus(regionId, isEnabled) {
  $.ajax({
    url: '/newregions/toggleStatus',
    type: 'POST',
    contentType: 'application/json',  // Indica que estás enviando JSON
    data: JSON.stringify({            // Convierte el objeto a JSON string
      identifier: regionId,
      isEnabled: isEnabled          // Asegúrate de que esta propiedad tenga el mismo nombre que en el backend
    }),
    success: function (response) {
      if (response.code == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Region status updated successfully.'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the region status. Please try again.'
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error updating the region status. Please try again.'
      });
    }
  });
}






// This function is designed to select a specific region from the list by its tag ID.
function selectRegion(tagId) {
  // Step 1: Remove the 'selected' class from all list items.
  // This ensures that no other region is marked as selected.
  $('#Region-list li').removeClass('selected');

  // Step 2: Extract the identifier from the provided tagId.
  // This will help fetch the exact region from the backend.
  const regionId = tagId.replace('region', '');

  // Step 3: Perform an AJAX request to get data about the region using its identifier.
  $.ajax({
    url: '/newregions/fetchRegionById',  // Endpoint where the region data can be fetched by ID
    type: 'GET',
    data: { identifier: regionId },  // The identifier is sent as a parameter to the backend
    success: function (data) {
      // If the request was successful and the server responded with "OK"
      if (data.code == "OK") {
        matchedRegion = data.object; // Store the fetched region data

        // If the region is found and matched
        if (matchedRegion) {
          // Step 4: Highlight the selected region in the list
          $(`#${tagId}`).addClass('selected');
          console.log("Region found", matchedRegion);
        } else {
          console.log("Region not found in the database");
          console.log("Searched ID:", regionId);
        }
      } else {
        // If the server responds with an error code
        console.log("Error fetching the region:", data.message);
      }
    },
    error: function () {
      // If the AJAX request itself fails (e.g., network error, invalid URL)
      console.log("Error making the AJAX request to fetch the region");
    }
  });
}

// Set up an event listener for when any list item inside '#Region-list' is clicked.
$(document).on('click', '#Region-list li', function () {
  // When a region list item is clicked, call the 'selectRegion' function with its ID
  selectRegion(this.id);
});


// This script block is for confirming the selection of a region and proceeding to the next tab.
$(document).ready(function () {
  // When the page is fully loaded, set up the following:

  // Add a click event listener to the "confirmRegionBtn" button
  $("#confirmRegionBtn").click(function () {

    // Check if a region has been matched/selected
    if (matchedRegion) {

      // Check if the selected region is disabled (i.e., isEnabled set to false)
      if (!matchedRegion.isEnabled) {
        // If so, inform the user that the selected region is disabled and cannot be confirmed
        Swal.fire({
          icon: 'error',
          title: 'Action Prohibited',
          text: 'The selected region is disabled and cannot be confirmed.'
        });
        return; // This halts further execution of the function
      }

      // Prompt the user to confirm their selection of the region
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to confirm the selection of ${matchedRegion.regionName}. Do you want to proceed?`,
        icon: 'warning',
        showCancelButton: true,  // Display a cancel button
        confirmButtonText: 'Yes, confirm',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        // If the user confirms, switch to the 'env-and-infra' tab
        if (result.isConfirmed) {
          $('#env-and-infra-tab').tab('show');
        }
      });

      // If there are other actions you wish to perform after confirming the selection, they would be placed here

    } else {
      // If no region has been selected, inform the user to make a selection
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please, select a region before confirming.'
      });
    }
  });
});


// Add new region
$(document).ready(function () {

  function isValidInput(value, id) {
    const allowSpacesInMiddle = ["identifier", "Region"];

    // If the value has spaces at the beginning or end, it's invalid.
    if (value.trim() !== value) {
      return false;
    }

    // If the ID is not in the list that allows spaces in the middle but has spaces in the middle, it's invalid.
    if (!allowSpacesInMiddle.includes(id) && value.includes(" ")) {
      return false;
    }

    return true;
  }

  function validateField(fieldId) {
    const value = $(fieldId).val();

    if (value === "" || !isValidInput(value, fieldId.replace("#", ""))) {
      $(fieldId).addClass('is-invalid'); // Mark the field as invalid
      return false;
    } else {
      $(fieldId).removeClass('is-invalid'); // If valid, remove the invalid mark
      return value;
    }
  }

  $("#addRegion").click(function () {
    const modalContent = `
    <div class="modal-header">
        <h5 class="modal-title">Add New Region</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    </div>
    <div class="modal-body">
        <form id="regionForm">

            <div class="form-group">
                <label for="identifierInput">Identifier:</label>
                <input type="text" class="form-control" id="identifierInput" placeholder="Enter identifier">
            </div>
            <div class="form-group">
                <label for="regionInput">Region:</label>
                <input type="text" class="form-control" id="regionInput" placeholder="Enter region name">
            </div>
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="isEnabledInput">
                <label class="custom-control-label" for="isEnabledInput">Enabled</label>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-outline-primary" id="saveRegion">Accept</button>
    </div>
`;
    // Add the content to the modal
    $("#RegionModalAdd .modal-content").html(modalContent);
    // Open the modal
    $("#RegionModalAdd").modal("show");
  });

  $("#RegionModalAdd").on("click", "#saveRegion", function () {
    const entityId = matchedCompany.entity_id; //we use the entity_id from the matchedCompany
    const identifier = validateField("#identifierInput");
    const region = validateField("#regionInput");
    const isEnabled = $("#isEnabledInput").prop("checked");

    if (!(entityId && identifier && region)) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete or Invalid Fields',
        text: 'Please complete and correct all highlighted fields.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "The new region will be added with the provided data.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newRegion = {
          "entity_id": entityId,
          "identifier": identifier,
          "Region": region,
          "isEnabled": isEnabled
        };

        $.ajax({
          url: "/newregions/saveRegions",
          type: "POST",
          dataType: "json",
          data: newRegion,
          success: function (response) {
            if (response.code === "OK") {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Region data has been saved successfully',
              });
              $("#RegionModalAdd").modal("hide");
              //Clear the form Fields
              //LIMPIA LA LISTA DE REGIONES
              regionList.innerHTML = "";
              //VUELVE A CARGAR LA LISTA DE REGIONES
              fetchAndDisplayRegions(matchedCompany.entity_id);
              //CONSOLE LOG PARA VERIFICAR QUE SE ESTA ENVIANDO LA INFORMACION
              console.log(newRegion);



            } else {
              console.log("Unexpected response from the server:", response);
            }
          },
          error: function (error) {
            if (error.status === 409) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'A region with that identifier or name already exists.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error sending region data to the controller.',
              });
            }
          },
        });
      }
    });
  });
});


// Edit region
$(document).ready(function () {

  function showRegionModalContent(editRegion) {
    const isEditing = editRegion !== undefined;

    const modalContent = `
          <div class="modal-header">
              <h5 class="modal-title">${isEditing ? 'Edit Region ' + editRegion.identifier : 'Add New Region'}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <i class="fas fa-times"></i>
              </button>
          </div>
          <div class="modal-body">
              <form id="regionForm">
                  <div class="form-group">
                      <label for="identifierInput">Identifier:</label>
                      <input type="text" class="form-control" id="identifierInput" placeholder="Enter identifier" value="${isEditing ? editRegion.identifier : ''}" ${isEditing ? 'readonly' : ''}>
                  </div>
                  <div class="form-group">
                      <label for="regionInput">Region:</label>
                      <input type="text" class="form-control" id="regionInput" placeholder="Enter region name" value="${isEditing ? editRegion.Region : ''}">
                  </div>
                  <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${isEditing && editRegion.isEnabled ? 'checked' : ''}>
                      <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                  </div>
              </form>
          </div>
          <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-outline-primary" id="updatedRegion">${isEditing ? 'Update' : 'Accept'}</button>
          </div>
      `;

    // Adjust the modal ID for editing regions
    $("#RegionModalEdit .modal-content").html(modalContent);
    $("#RegionModalEdit").modal("show");
  }

  $("#editRegion").click(function () {
    if (!matchedRegion) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a region before continuing.',
      });
      return;
    }
    showRegionModalContent(matchedRegion);
  });

  function hasChanges(editedRegion, originalRegion) {
    return editedRegion.identifier !== originalRegion.identifier ||
      editedRegion.Region !== originalRegion.Region ||
      editedRegion.isEnabled !== originalRegion.isEnabled;
  }

  $("#RegionModalEdit").on("click", "#updatedRegion", function () {
    const identifier = $("#identifierInput").val().trim();
    const region = $("#regionInput").val().trim();
    const isEnabled = $("#isEnabledInput").is(":checked");

    const updatedRegion = {
      "entity_id": matchedRegion.entity_id,  // Keep the same entity_id
      "identifier": identifier,
      "Region": region,
      "isEnabled": isEnabled
    };

    if (hasChanges(updatedRegion, matchedRegion)) {
      Swal.fire({
        title: 'Are you sure?',
        text: "The region will be updated with the provided data.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          saveUpdatedRegion(updatedRegion);
        }
      });
    } else {
      saveUpdatedRegion(updatedRegion);
    }
  });

  function saveUpdatedRegion(updatedRegion) {
    $.ajax({
      url: '/newregions/edit-regions',
      type: 'PUT',
      data: updatedRegion,
      success: function (response) {
        if (response.code === "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Region updated successfully',
            showConfirmButton: false,
            timer: 1500
          });
          $("#RegionModalEdit").modal("hide");
          // Reload the page to view the updated region
          //LIMPIA LA LISTA DE REGIONES
          regionList.innerHTML = "";
          //VUELVE A CARGAR LA LISTA DE REGIONES
          fetchAndDisplayRegions(matchedCompany.entity_id);

        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error updating the region',
            text: response.message
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'The region could not be updated. Please try again later.'
        });
      }
    });
  }
});

// This script block is dedicated to the functionality of deleting a region.

$(document).ready(function () {

  // When the "Delete Region" button is clicked
  $("#deleteRegion").click(function () {
    // If no region has been selected, notify the user.
    if (!matchedRegion) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a region before continuing.',
      });
      return;
    }

    // Confirm the deletion action from the user.
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this region?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, send a request to delete the region.
        deleteRegion(matchedRegion.identifier);
        //LIMPIA LA LISTA DE REGIONES
        regionList.innerHTML = "";
        //VUELVE A CARGAR LA LISTA DE REGIONES
        fetchAndDisplayRegions(matchedCompany.entity_id);
      }
    });
  });

  // Function to send a DELETE request to the server to delete the selected region.
  function deleteRegion(identifier) {
    $.ajax({
      // Assuming the identifier is appended to the URL
      url: `/newregions/deleteRegion/${identifier}`,
      type: 'DELETE',
      success: function (response) {
        // If the server returns a successful response, notify the user of the successful deletion.
        if (response.code === "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Deleted successfully',
            text: 'The region has been successfully deleted',
            showConfirmButton: false,
            timer: 1500
          });
          // Optionally, refresh the page or update the UI to reflect the deletion.

        } else {
          // If there's an issue, notify the user.
          Swal.fire({
            icon: 'error',
            title: 'Error while deleting',
            text: response.message
          });
        }
      },
      error: function () {
        // If there's a server error or the request fails, notify the user.
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'The region could not be deleted. Please try again later.'
        });
      }
    });
  }
});
