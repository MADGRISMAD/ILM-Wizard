var companies = [];  // Changed the name to avoid confusion.
let matchedCompany = null;
var companyList = document.getElementById("company-list");

function getCompaniesByName(companyName, companies) {
  return companies.filter(company => company.Company === companyName);
}

function fetchAndDisplayCompanies(matchedCompanyName) {
  // Make an AJAX request to get company data
  $.ajax({
    url: '/newcompanies/getCompanies',
    type: 'GET',
    success: function (data) {
      if (data.code == "OK") {
        const companies = data.object;
        const companiesWithName = getCompaniesByName(matchedCompanyName, companies);

        for (var i = 0; i < companiesWithName.length; i++) {
          var company = companiesWithName[i];
          var listItem = document.createElement("li");
          listItem.className = "list-group-item d-flex justify-content-between align-items-center list-item-centered";
          listItem.id = "company" + company.identifier;

          var companyText = document.createElement("span");
          companyText.textContent = company.identifier;
          listItem.appendChild(companyText);

          // If the company has isEnabled set to false, shade in gray and add "DISABLED"
          if (!company.isEnabled) {
            listItem.style.backgroundColor = "#d3d3d3"; // light gray
            var disabledText = document.createElement("span");
            disabledText.textContent = "";
            companyText.appendChild(disabledText);
          }

          // Create the checkbox for each company
          var checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.id = "checkboxCompany" + company.identifier;
          updateCheckboxStatusComp(checkbox, company.isEnabled, company.identifier);
          listItem.appendChild(checkbox);

          companyList.appendChild(listItem);
        }
      }
    },
    error: function () {
      alert('There was an error fetching company data.');
    }
  });
}
$("#confirmSelection").click(function () {
  companyList.innerHTML = "";  // Clears the company list
  if (matchedEntity) {
    fetchAndDisplayCompanies(matchedEntity.companyName);
  }
});


function updateCheckboxStatusComp(checkbox, isEnabled, regionId) {
  checkbox.checked = isEnabled;
  checkbox.onclick = function (event) {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You are about to " + (this.checked ? "deactivate" : "activate") + " this company.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.checked = !this.checked;
        updateCompanyStatus(regionId, this.checked);
      }
    });
  };
}

function updateCompanyStatus(regionId, isEnabled) {
  $.ajax({
    url: '/newcompanies/toggleStatus',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      identifier: regionId,
      isEnabled: isEnabled
    }),
    success: function (response) {
      if (response.code == "OK") {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Company status updated successfully.'
        });

        // Vaciar la lista de empresas
        companyList.innerHTML = "";
        // Obtener y mostrar la nueva lista de empresas
        fetchAndDisplayCompanies(matchedEntity.companyName);

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the company status. Please try again.'
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error updating the company status. Please try again.'
      });
    }
  });
}





$(document).ready(function () {






  //update the list to show any changes


});




// Select a company from the list
function selectCompany(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#company-list li').removeClass('selected');

  // 2. Extract identifier from tagId
  const companyId = tagId.replace('company', '');

  // 3. Make an AJAX request to get company data by its identifier
  $.ajax({
    url: '/newcompanies/getCompanyById',  // Server route where the company is retrieved by ID
    type: 'GET',
    data: { identifier: companyId },  // Send the identifier as a parameter
    success: function (data) {
      if (data.code == "OK") {
        matchedCompany = data.object;

        if (matchedCompany) {
          // 4. Add 'selected' class to the list item
          $(`#${tagId}`).addClass('selected');
          console.log("company found", matchedCompany);
        } else {
          console.log("company not found in the database");
          console.log("Searched ID:", companyId);
        }

      } else {
        console.log("Error retrieving the company:", data.message);
      }
    },
    error: function () {
      console.log("Error performing the AJAX request to retrieve the company");
    }
  });
}

$(document).on('click', '#company-list li', function () {
  selectCompany(this.id);
});





// Update the entity card
$(document).ready(function () {
  $("#confirmSelection").click(function () {
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

  function updateCard(entity) {
    if (!entity.flag || !entity.companyName) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Entity data is incomplete or invalid.',
      });
      return;  // Exit the function if the data is not valid
    }

    // Update the entity logo
    const imgElement = $(".card-img-top.current-company");
    if (!imgElement.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not find the image element.',
      });
      return;  // Exit the function if the element is not found
    }
    imgElement.attr("src", entity.flag);

    // Update the name of the entity
    const nameElement = $("#company-name");
    if (!nameElement.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not find the entity name element.',
      });
      return;  // Exit the function if the element is not found
    }
    nameElement.text(entity.companyName);
  }
});








// Modal to add a new company
$(document).ready(function () {

  function isValidInput(value, id) {
    if (!value) return false; // Añadido para manejar valores null o undefined

    const allowSpacesInMiddle = ["regionClientCode", "cmdbCompany", "company", "delivery", "identifier", "nicName", "shortName", "vdc"];
    if (value.trim() !== value) return false;
    if (!allowSpacesInMiddle.includes(id) && value.includes(" ")) return false;
    return true;
  }


  function validateField(fieldId) {
    const value = $(fieldId).val();
    if (value === "" || !isValidInput(value, fieldId.replace("#", ""))) {
      $(fieldId).addClass('is-invalid');
      return false;
    } else {
      $(fieldId).removeClass('is-invalid');
      return value;
    }
  }

  $("#addCompany").click(function () {
    const defaultValueForCompany = matchedEntity ? matchedEntity.companyName : '';
    const deliveryOptions = ["Option1", "Option2", "Option3"];
    const vdcOptions = ["OptionA", "OptionB", "OptionC"];

    const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">Add New Company</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="companyForm">
                <input type="hidden" id="entityIdInput" value="${matchedEntity ? matchedEntity.companyName : ''}">
                    <div class="row">
                        <div class="col-md-6"> <!-- First column -->
                            <div class="form-group">
                                <label for="identifierInput">Identifier:</label>
                                <input type="text" class="form-control" id="identifierInput" placeholder="Enter identifier">
                            </div>
                            <div class="form-group">
                                <label for="companyInput">Company:</label>
                                <input type="text" class="form-control" id="companyInput" placeholder="Enter company name" value="${defaultValueForCompany}">
                            </div>
                            <div class="form-group">
                                <label for="hostnamePrefixInput">Hostname Prefix:</label>
                                <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Enter hostname prefix">
                            </div>
                            <div class="form-group">
                                <label for="regionClientCodeInput">Region or Client Code:</label>
                                <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Enter region or client code">
                            </div>
                            <div class="form-group">
                                <label for="deliveryInput">Delivery:</label>
                                <select class="form-control" id="deliveryInput">
                                    ${deliveryOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="vdcInput">VDC:</label>
                                <select class="form-control" id="vdcInput">
                                    ${vdcOptions.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6"> <!-- Second column -->
                            <div class="form-group">
                                <label for="cmdbCompanyInput">CMDB Company:</label>
                                <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Enter CMDB_company">
                            </div>
                            <div class="custom-control custom-checkbox mb-3">
                                <input type="checkbox" class="custom-control-input" id="isEnabledInput" checked>
                                <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                            </div>
                            <div class="form-group">
                                <label for="shortNameInput">Short Name:</label>
                                <input type="text" class="form-control" id="shortNameInput" placeholder="Enter short name">
                            </div>
                            <div class="form-group">
                                <label for="nicNameInput">Nic Name:</label>
                                <input type="text" class="form-control" id="nicNameInput" placeholder="Enter Nic Name">
                            </div>
                            <div class="form-group">
                                <label for="regionInput">Region:</label>
                                <input type="text" class="form-control" id="regionInput" placeholder="Enter region">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-outline-primary" id="saveCompany">Accept</button>
            </div>
        `;

    // Add content to modal
    $("#companyModal .modal-content").html(modalContent);
    // Open modal
    $("#companyModal").modal("show");
  });

  $("#companyModal").on("click", "#saveCompany", function () {
    const entityId = $("#entityIdInput").val();

    const identifier = validateField("#identifierInput");
    const company = validateField("#companyInput");
    const hostnamePrefix = validateField("#hostnamePrefixInput");
    const regionClientCode = validateField("#regionClientCodeInput");
    const delivery = validateField("#deliveryInput");
    const vdc = validateField("#vdcInput");
    const cmdbCompany = validateField("#cmdbCompanyInput");
    const shortName = validateField("#shortNameInput");
    const nicName = validateField("#nicNameInput");
    const region = validateField("#regionInput");
    const isEnabled = $("#isEnabledInput").prop("checked");

    if (!(identifier && company && hostnamePrefix && regionClientCode && delivery && vdc && cmdbCompany && shortName && nicName && region)) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete or Invalid Fields',
        text: 'Please complete and correct all highlighted fields.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "The new company will be added with the provided data.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const newCompany = {
          "entity_id": entityId,
          "identifier": identifier,
          "Company": company,
          "Hostname_prefix": hostnamePrefix,
          "Region_or_client_code": regionClientCode,
          "Delivery": delivery,
          "VDC": vdc,
          "CMDB_company": cmdbCompany,
          "isEnabled": isEnabled,

          "short_name": shortName,
          "nicName": nicName,
          "region": region
        };

        $.ajax({
          url: "/newcompanies/saveCompanies",
          type: "POST",
          dataType: "json",
          data: newCompany,
          success: function (response) {
            if (response.code === "OK") {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Company data has been saved successfully',
              });
              $("#companyModal").modal("hide");
              $('#company-tab').tab('show');
              // Reload the table to display the new company
              //clear the list
              companyList.innerHTML = "";
              //fetch the new list

              fetchAndDisplayCompanies(matchedEntity.companyName)

            } else {
              console.log("Unexpected server response:", response);
            }
          },
          error: function (error) {
            if (error.status === 409) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'A company with that identifier or name already exists.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error sending company data to the controller.',
              });
            }
          },
        });
      }
    });
  });
});



// Modal to edit company
$(document).ready(function () {

  function showCompanyModalContent(editCompany) {
    const isEditing = editCompany !== undefined;
    const deliveryOptions = ["Option1", "Option2", "Option3"];
    const vdcOptions = ["OptionA", "OptionB", "OptionC"];

    const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${isEditing ? 'Edit Company ' + editCompany.identifier : 'Add New Company'}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="modal-body">
          <form id="companyForm">
              <input type="hidden" id="entityIdInput" value="${matchedEntity ? matchedEntity.companyName : ''}">
              <div class="row">
                  <div class="col-md-6"> <!-- First column -->
                      <div class="form-group">
                          <label for="identifierInput">Identifier:</label>
                          <input type="text" class="form-control" id="identifierInput" placeholder="Enter identifier" value="${isEditing ? editCompany.identifier : ''}" ${isEditing ? 'readonly' : ''}>
                      </div>
                      <div class="form-group">
                          <label for="companyInput">Company:</label>
                          <input type="text" class="form-control" id="companyInput" placeholder="Enter company name" value="${isEditing ? editCompany.Company : ''}" ${isEditing ? 'readonly' : ''}>
                      </div>
                      <div class="form-group">
                          <label for="hostnamePrefixInput">Hostname Prefix:</label>
                          <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Enter hostname prefix" value="${isEditing ? editCompany["Hostname_prefix"] : ''}">
                      </div>
                      <div class="form-group">
                          <label for="regionClientCodeInput">Region or Client Code:</label>
                          <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Enter region or client code" value="${isEditing ? editCompany["Region_or_client_code"] : ''}">
                      </div>
                      <div class="form-group">
                          <label for="deliveryInput">Delivery:</label>
                          <input type="text" class="form-control" id="deliveryInput" placeholder="Enter delivery" value="${isEditing ? editCompany.Delivery : ''}">
                      </div>
                      <div class="form-group">
                          <label for="vdcInput">VDC:</label>
                          <input type="text" class="form-control" id="vdcInput" placeholder="Enter VDC" value="${isEditing ? editCompany.VDC : ''}">
                      </div>
                  </div>
                  <div class="col-md-6"> <!-- Second column -->
                      <div class="form-group">
                          <label for="cmdbCompanyInput">CMDB Company:</label>
                          <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Enter CMDB company" value="${isEditing ? editCompany["CMDB_company"] : ''}">
                      </div>
                      <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${isEditing && editCompany.isEnabled ? 'checked' : ''}>
                          <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                      </div>
                      <div class="form-group">
                          <label for="selectInput">Select:</label>
                          <input type="text" class="form-control" id="selectInput" placeholder="Enter select" value="${isEditing ? editCompany.select : ''}">
                      </div>
                      <div class="form-group">
                          <label for="shortNameInput">Short Name:</label>
                          <input type="text" class="form-control" id="shortNameInput" placeholder="Enter short name" value="${isEditing ? editCompany.short_name : ''}">
                      </div>
                      <div class="form-group">
                          <label for="nicNameInput">Nic Name:</label>
                          <input type="text" class="form-control" id="nicNameInput" placeholder="Enter Nic Name" value="${isEditing ? editCompany.nicName : ''}">
                      </div>
                      <div class="form-group">
                          <label for="regionInput">Region:</label>
                          <input type="text" class="form-control" id="regionInput" placeholder="Enter region" value="${isEditing ? editCompany.region : ''}">
                      </div>
                  </div>
              </div>
          </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-outline-primary" id="saveEditedCompany">${isEditing ? 'Update' : 'Accept'}</button>
      </div>
    `;

    $("#companyEditModal .modal-content").html(modalContent);
    $("#companyEditModal").modal("show");
  }

  $("#editCompanyBtn").click(function () {
    if (!matchedCompany) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a company before continuing.',
      });
      return;
    }
    showCompanyModalContent(matchedCompany);
  });

  function hasChanges(updatedCompany, originalCompany) {
    return updatedCompany.companyName !== originalCompany.Company ||
      updatedCompany["Hostname_prefix"] !== originalCompany["Hostname_prefix"] ||
      updatedCompany["Region_or_client_code"] !== originalCompany["Region_or_client_code"] ||
      updatedCompany.Delivery !== originalCompany.Delivery ||
      updatedCompany.VDC !== originalCompany.VDC ||
      updatedCompany["CMDB_company"] !== originalCompany["CMDB_company"] ||
      updatedCompany.isEnabled !== originalCompany.isEnabled ||
      updatedCompany.select !== originalCompany.select ||
      updatedCompany.short_name !== originalCompany.short_name ||
      updatedCompany.nicName !== originalCompany.nicName ||
      updatedCompany.region !== originalCompany.region;
    updatedCompany.entity_id !== originalCompany.entity_id;
  }

  $("#companyEditModal").on("click", "#saveEditedCompany", function () {

    const entityId = $("#entityIdInput").val().trim();
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

    const updatedCompany = {
      "entity_id": entityId,
      "identifier": identifier,
      "Company": companyName,
      "Hostname Prefix": hostnamePrefix,
      "Region_or_client_code": regionClientCode,
      "Delivery": delivery,
      "VDC": vdc,
      "CMDB_company": cmdbCompany,
      "isEnabled": isEnabled,
      "select": select,
      "short_name": shortName,
      "nicName": nicName,
      "region": region
    };

    if (hasChanges(updatedCompany, matchedCompany)) {
      Swal.fire({
        title: 'Are you sure?',
        text: "The company will be updated with the provided data.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          performCompanyUpdate(updatedCompany);
        }
      });
    } else {
      performCompanyUpdate(updatedCompany);
    }
  });

  function performCompanyUpdate(updatedCompany) {
    $.ajax({
      url: '/newcompanies/edit-companies',
      type: 'PUT',
      data: updatedCompany,
      success: function (response) {
        if (response.code === "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Company successfully saved',
            showConfirmButton: false,
            timer: 1500
          });
          $("#companyEditModal").modal("hide");
          companyList.innerHTML = "";
          //fetch the new list

          fetchAndDisplayCompanies(matchedEntity.companyName)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error saving the company',
            text: response.message
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'Could not save the company. Please try again later.'
        });
      }
    });
  }
});



// Delete company
$(document).ready(function () {
  $("#deleteCompanyBtn").click(function () {
    if (!matchedCompany) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a company before proceeding.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this company?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        performCompanyDeletion(matchedCompany.identifier);
      }
    });
  });

  function performCompanyDeletion(identifier) {
    $.ajax({
      url: `/newcompanies/deleteCompany/${identifier}`,  // Assuming you send the identifier in the URL
      type: 'DELETE',
      success: function (response) {
        if (response.code === "OK") {
          Swal.fire({
            icon: 'success',
            title: 'Successfully Deleted',
            text: 'The company has been successfully deleted',
            showConfirmButton: false,
            timer: 1500
          });
          // Optionally: update the interface to reflect the deletion
          companyList.innerHTML = "";
          //fetch the new list

          fetchAndDisplayCompanies(matchedEntity.companyName)
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error deleting',
            text: response.message
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Could not delete the company. Please try again later.'
        });
      }
    });
  }
});




//confirm and go to next tab
// Confirm and go to the next tab
$(document).ready(function () {

  // Add a click event to the confirmation button
  $("#confirmCompanyBtn").click(function () {
    if (matchedCompany) {
      if (!matchedCompany.isEnabled) {
        // If the matchedCompany has isEnabled set to false, display an error message and don't proceed.
        Swal.fire({
          icon: 'error',
          title: 'Action Prohibited',
          text: 'The selected company is disabled and cannot be confirmed.'
        });
        return; // This ends the function here and won't execute the following code.
      }

      // Ask if the user really wants to confirm the selection
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to confirm the selection of ${matchedCompany.company}. Do you want to continue?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, confirm',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          $('#region-tab').tab('show');
        }
      });

      // Other actions you might want to perform after confirming the selection

    } else {
      // Show a message if no company is selected
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select a company before confirming.'
      });
    }
  });
});

//
