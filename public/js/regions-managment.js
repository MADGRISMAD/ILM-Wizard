let matchedRegion = null;  // Variable to store the selected region

// Update the entity card
$(document).ready(function () {
    $("#confirmCompanyBtn").click(function() {
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
        if (!entities.flag || !entities.companyName) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Entity data is incomplete or invalid.',
            });
            return;  // Exit the function if the data is invalid
        }

        // Update the entity logo
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

        // Update the entity name
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
    }
});

// Display the list of regions
$(document).ready(function () {
    var regionList = document.getElementById("Region-list");

    $("#confirmCompanyBtn").click(function() {
        regionList.innerHTML = "";  // Clear the region list.
        if (matchedCompany) {  // Ensure that the company is selected
            fetchAndDisplayRegions(matchedCompany.entity_id);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please, select a company before proceeding.',
            });
        }
    });

    function fetchAndDisplayRegions(selectedEntityId) {
        // Make an AJAX request to fetch the region data
        $.ajax({
            url: '/newregions/fetchRegions',
            type: 'GET',
            data: { entity_id: selectedEntityId },  // Sending entity_id as a query parameter
            success: function(data) {
                if (data.code == "OK") {
                    const filteredRegions = data.object;

                    for (var i = 0; i < filteredRegions.length; i++) {
                        var region = filteredRegions[i];

                        var listItem = document.createElement("li");
                        listItem.className = "list-group-item d-flex justify-content-between align-items-center list-item-centered";
                        listItem.id = "region" + region.identifier;
                        listItem.textContent = region.Region;

                        // If the region has isEnabled set to false, shade in gray and append "DISABLED"
                        if (!region.isEnabled) {
                            listItem.style.backgroundColor = "#d3d3d3"; // light gray
                            listItem.textContent ;
                        }

                        regionList.appendChild(listItem);
                    }
                }
            },
            error: function() {
                alert('There was an error fetching region data.');
            }
        });
    }
});

// Select a region from the list
function selectRegion(tagId) {
    // 1. Remove 'selected' class from all list items
    $('#Region-list li').removeClass('selected');

    // 2. Extract identifier from tagId
    const regionId = tagId.replace('region', '');

    // 3. Make an AJAX request to fetch the region data by its identifier
    $.ajax({
        url: '/newregions/fetchRegionById',  // Server route where the region is fetched by ID
        type: 'GET',
        data: { identifier: regionId },  // Send the identifier as a parameter
        success: function(data) {
            if (data.code == "OK") {
                matchedRegion = data.object;

                if (matchedRegion) {
                    // 4. Add 'selected' class to the list item
                    $(`#${tagId}`).addClass('selected');
                    console.log("Region found", matchedRegion);
                } else {
                    console.log("Region not found in the database");
                    console.log("Searched ID:", regionId);
                }
            } else {
                console.log("Error fetching the region:", data.message);
            }
        },
        error: function() {
            console.log("Error making the AJAX request to fetch the region");
        }
    });
}

// Event listener for click on list items
$(document).on('click', '#Region-list li', function() {
    selectRegion(this.id);
});

// Confirm region and show next tab
$(document).ready(function () {
    // Add a click event to the confirmation button
    $("#confirmRegion").click(function() {
        if (matchedRegion) {
            if (!matchedRegion.isEnabled) {
                // If matchedRegion has isEnabled set to false, display an error message and do not proceed.
                Swal.fire({
                    icon: 'error',
                    title: 'Action Prohibited',
                    text: 'The selected region is disabled and cannot be confirmed.'
                });
                return; // This ends the function here and won't execute the code below.
            }

            // Ask if you really want to confirm the selection
            Swal.fire({
                title: 'Are you sure?',
                text: `You are about to confirm the selection of ${matchedRegion.regionName}. Do you want to proceed?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, confirm',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#env-and-infra-tab').tab('show');
                }
            });

            // Other actions you wish to perform after confirming the selection

        } else {
            // Display a message if no region is selected
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
                      <label for="entityIdInput">Entity ID:</label>
                      <input type="text" class="form-control" id="entityIdInput" placeholder="Enter entity ID">
                  </div>
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
      const entityId = validateField("#entityIdInput");
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
                  location.reload();
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

// Delete region
$(document).ready(function() {
  $("#deleteRegion").click(function() {
      if (!matchedRegion) { // I assume matchedRegion is the object that holds the selected region
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Please, select a region before continuing.',
          });
          return;
      }

      Swal.fire({
          title: 'Are you sure?',
          text: "Do you really want to delete this region?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, delete',
          cancelButtonText: 'Cancel'
      }).then((result) => {
          if (result.isConfirmed) {
              deleteRegion(matchedRegion.identifier);
          }
      });
  });

  function deleteRegion(identifier) {
      $.ajax({
          url: `/newregions/deleteRegion/${identifier}`,  // Assuming you send the identifier in the URL
          type: 'DELETE',
          success: function(response) {
              if (response.code === "OK") {
                  Swal.fire({
                      icon: 'success',
                      title: 'Deleted successfully',
                      text: 'The region has been successfully deleted',
                      showConfirmButton: false,
                      timer: 1500
                  });
                  // Optional: update the UI to reflect the deletion
                  location.reload();
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error while deleting',
                      text: response.message
                  });
              }
          },
          error: function() {
              Swal.fire({
                  icon: 'error',
                  title: 'Server error',
                  text: 'The region could not be deleted. Please try again later.'
              });
          }
      });
  }
});
