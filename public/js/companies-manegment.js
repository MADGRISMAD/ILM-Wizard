var companies = [];  // Changed the name to avoid confusion.
let matchedCompany = null;

$(document).ready(function () {
  var companyList = document.getElementById("company-list");

    $("#confirmSelection").click(function() {
        companyList.innerHTML = "";  // Clears the company list
        if (matchedEntity) {
            fetchAndDisplayCompanies(matchedEntity.companyName);
        }
    });

  function fetchAndDisplayCompanies(selectedCompanyName) {
    // Make an AJAX request to get company data
    $.ajax({
      url: '/newentities/getCompanies',
      type: 'GET',
      success: function (data) {
        if (data.code == "OK") {
          const companies = data.object;

          const companiesWithName = getCompaniesByName(selectedCompanyName, companies);

          for (var i = 0; i < companiesWithName.length; i++) {
            var company = companiesWithName[i];

            var listItem = document.createElement("li");
            listItem.className = "list-group-item d-flex justify-content-between align-items-center";
            listItem.id = "company" + company.identifier;
            listItem.textContent = company.identifier;

            // If the company has isEnabled set to false, shade in gray and add "DISABLED"
            if (!company.isEnabled) {
                listItem.style.backgroundColor = "#d3d3d3"; // light gray
                listItem.textContent += "(disabled)";
            }

            companyList.appendChild(listItem);
        }

        }
      },
      error: function () {
        alert('There was an error fetching company data.');
      }
    });

    function getCompaniesByName(companyName, companies) {
      return companies.filter(function (company) {
        return company.Company === companyName;
      });
    }
  }
});




// Select a company from the list
function selectCompany(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#company-list li').removeClass('selected');

  // 2. Extract identifier from tagId
  const companyId = tagId.replace('company', '');

  // 3. Make an AJAX request to get company data by its identifier
  $.ajax({
    url: '/newentities/getCompanyById',  // Server route where the company is retrieved by ID
    type: 'GET',
    data: { identifier: companyId },  // Send the identifier as a parameter
    success: function(data) {
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
    error: function() {
      console.log("Error performing the AJAX request to retrieve the company");
    }
  });
}

$(document).on('click', '#company-list li', function() {
  selectCompany(this.id);
});





// Update the entity card
$(document).ready(function () {
  $("#confirmSelection").click(function() {
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
    const allowSpacesInMiddle = ["regionClientCode", "cmdbCompany", "company", "delivery", "identifier", "nicName", "shortName", "vdc"];

    // If the value has spaces at the beginning or end, it's invalid.
    if (value.trim() !== value) {
        return false;
    }

    // If the ID isn't in the list that allows spaces in the middle but has spaces in the middle, it's invalid.
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

  $("#addCompany").click(function () {
    const defaultValueForCompany = matchedEntity ? matchedEntity.companyName : '';
    const modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">Add New Company</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="companyForm">
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
                                <input type="text" class="form-control" id="deliveryInput" placeholder="Enter delivery">
                            </div>
                            <div class="form-group">
                                <label for="vdcInput">VDC:</label>
                                <input type="text" class="form-control" id="vdcInput" placeholder="Enter VDC">
                            </div>
                        </div>
                        <div class="col-md-6"> <!-- Second column -->
                            <div class="form-group">
                                <label for="cmdbCompanyInput">CMDB Company:</label>
                                <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Enter CMDB company">
                            </div>
                            <div class="custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="isEnabledInput" checked>
                                <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                            </div>
                            <div class="form-group">
                                <label for="selectInput">Select:</label>
                                <input type="text" class="form-control" id="selectInput" placeholder="Enter select">
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
    const identifier = validateField("#identifierInput");
    const company = validateField("#companyInput");
    const hostnamePrefix = validateField("#hostnamePrefixInput");
    const regionClientCode = validateField("#regionClientCodeInput");
    const delivery = validateField("#deliveryInput");
    const vdc = validateField("#vdcInput");
    const cmdbCompany = validateField("#cmdbCompanyInput");
    const select = validateField("#selectInput");
    const shortName = validateField("#shortNameInput");
    const nicName = validateField("#nicNameInput");
    const region = validateField("#regionInput");
    const isEnabled = $("#isEnabledInput").prop("checked");

    if (!(identifier && company && hostnamePrefix && regionClientCode && delivery && vdc && cmdbCompany && select && shortName && nicName && region)) {
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
                "identifier": identifier,
                "Company": company,
                "Hostname prefix": hostnamePrefix,
                "Region or client code": regionClientCode,
                "Delivery": delivery,
                "VDC": vdc,
                "CMDB company": cmdbCompany,
                "isEnabled": isEnabled,
                "select": select,
                "short_name": shortName,
                "nicName": nicName,
                "region": region
            };

            $.ajax({
                url: "/newentities/saveCompanies",
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
$(document).ready(function() {

  function showCompanyModalContent(editCompany) {
    const isEditing = editCompany !== undefined;

    const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${isEditing ? 'Edit Company ' + editCompany.identifier : 'Add New Company'}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="modal-body">
        <form id="companyForm">
            <div class="row">
                <div class="col-md-6"> <!-- First column -->
                    <div class="form-group">
                        <label for="identifierInput">Identifier:</label>
                        <input type="text" class="form-control" id="identifierInput" placeholder="Enter identifier" value="${isEditing ? editCompany.identifier : ''}" ${isEditing ? 'readonly' : ''}>
                    </div>
                    <div class="form-group">
                        <label for="companyInput">Company:</label>
                        <input type="text" class="form-control" id="companyInput" placeholder="Enter company name" value="${isEditing ? editCompany.Company : ''}">
                    </div>
                    <div class="form-group">
                        <label for="hostnamePrefixInput">Hostname Prefix:</label>
                        <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Enter hostname prefix" value="${isEditing ? editCompany["Hostname prefix"] : ''}">
                    </div>
                    <div class="form-group">
                        <label for="regionClientCodeInput">Region or Client Code:</label>
                        <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Enter region or client code" value="${isEditing ? editCompany["Region or client code"] : ''}">
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
                        <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Enter CMDB company" value="${isEditing ? editCompany["CMDB company"] : ''}">
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

  $("#editCompanyBtn").click(function() {
    if (!selectedCompany) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please, select a company before continuing.',
        });
        return;
    }
    showCompanyModalContent(selectedCompany);
  });

  function hasChanges(updatedCompany, originalCompany) {
    return updatedCompany.companyName !== originalCompany.Company ||
           updatedCompany["Hostname prefix"] !== originalCompany["Hostname prefix"] ||
           updatedCompany["Region or client code"] !== originalCompany["Region or client code"] ||
           updatedCompany.Delivery !== originalCompany.Delivery ||
           updatedCompany.VDC !== originalCompany.VDC ||
           updatedCompany["CMDB company"] !== originalCompany["CMDB company"] ||
           updatedCompany.isEnabled !== originalCompany.isEnabled ||
           updatedCompany.select !== originalCompany.select ||
           updatedCompany.short_name !== originalCompany.short_name ||
           updatedCompany.nicName !== originalCompany.nicName ||
           updatedCompany.region !== originalCompany.region;
  }

  $("#companyEditModal").on("click", "#saveEditedCompany", function() {

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
        "identifier": identifier,
        "Company": companyName,
        "Hostname Prefix": hostnamePrefix,
        "Region or client code": regionClientCode,
        "Delivery": delivery,
        "VDC": vdc,
        "CMDB company": cmdbCompany,
        "isEnabled": isEnabled,
        "select": select,
        "short_name": shortName,
        "nicName": nicName,
        "region": region
    };

    if (hasChanges(updatedCompany, selectedCompany)) {
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
        url: '/newentities/edit-companies',
        type: 'PUT',
        data: updatedCompany,
        success: function(response) {
            if (response.code === "OK") {
                Swal.fire({
                    icon: 'success',
                    title: 'Company successfully saved',
                    showConfirmButton: false,
                    timer: 1500
                });
                $("#companyEditModal").modal("hide");
                // Reload the tab to show the updated company
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error saving the company',
                    text: response.message
                });
            }
        },
        error: function() {
            Swal.fire({
                icon: 'error',
                title: 'Server error',
                text: 'Could not save the company. Please try again later.'
            });
        }
    });
  }
});



//delete company
$(document).ready(function() {
  $("#eliminarCompany").click(function() {
      if (!matchedCompany) {
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Por favor, selecciona una compañía antes de continuar.',
          });
          return;
      }

      Swal.fire({
          title: '¿Estás seguro?',
          text: "¿Realmente deseas eliminar esta compañía?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
      }).then((result) => {
          if (result.isConfirmed) {
              deleteCompany(matchedCompany.identifier);
          }
      });
  });

  function deleteCompany(identifier) {
      $.ajax({
          url: `/newentities/eliminarCompany/${identifier}`,  // Suponiendo que envías el identificador en la URL
          type: 'DELETE',
          success: function(response) {
              if (response.code === "OK") {
                  Swal.fire({
                      icon: 'success',
                      title: 'Eliminado con éxito',
                      text: 'La compañía ha sido eliminada con éxito',
                      showConfirmButton: false,
                      timer: 1500
                  });
                  // Opcional: actualiza la interfaz para reflejar la eliminación
                  location.reload();
              } else {
                  Swal.fire({
                      icon: 'error',
                      title: 'Error al eliminar',
                      text: response.message
                  });
              }
          },
          error: function() {
              Swal.fire({
                  icon: 'error',
                  title: 'Error de servidor',
                  text: 'No se pudo eliminar la compañía. Inténtalo de nuevo más tarde.'
              });
          }
      });
  }
});



//confirm and go to next tab

$(document).ready(function () {

  // Agregar un evento de clic al botón de confirmación
  $("#confirmCompany").click(function() {
      if (matchedCompany) {
          if (!matchedCompany.isEnabled) {
              // Si el matchedCompany tiene isEnabled en false, mostrar un mensaje de error y no continuar.
              Swal.fire({
                  icon: 'error',
                  title: 'Acción Prohibida',
                  text: 'La compañía seleccionada está deshabilitada y no puede ser confirmada.'
              });
              return; // Esto termina la función aquí y no ejecutará el código que sigue.
          }

          // Preguntar si realmente desea confirmar la selección
          Swal.fire({
              title: '¿Estás seguro?',
              text: `Estás a punto de confirmar la selección de ${matchedCompany.companyName}. ¿Deseas continuar?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, confirmar',
              cancelButtonText: 'Cancelar'
          }).then((result) => {
              if (result.isConfirmed) {
                  $('#region-tab').tab('show');
              }
          });

          // Otras acciones que desees realizar después de confirmar la selección

      } else {
          // Mostrar un mensaje si no hay ninguna compañía seleccionada
          Swal.fire({
              icon: 'warning',
              title: 'Sin Selección',
              text: 'Por favor, selecciona una compañía antes de confirmar.'
          });
      }
  });
});
