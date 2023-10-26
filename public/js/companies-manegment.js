var companies = []; // Changed the name to avoid confusion.
let matchedCompany = null;
var companyList = document.getElementById('company-list');

function getCompaniesByName(_id, companies) {
  return companies.filter((company) => company.parent_id === _id);
}

function fetchAndDisplayCompanies(_id) {
  // Make an AJAX request to get company data
  $.ajax({
    url: '/newcompanies/getCompanies',
    type: 'GET',
    success: function (data) {
      if (data.code == 'OK') {
        const companies = data.object;
        const companiesWithName = getCompaniesByName(_id, companies);

        for (var i = 0; i < companiesWithName.length; i++) {
          var company = companiesWithName[i];
          var listItem = document.createElement('li');
          listItem.className =
            'list-group-item d-flex justify-content-between align-items-center list-item-centered';
          listItem.id = 'company' + company._id;

          var companyText = document.createElement('span');
          companyText.textContent = company.Company;
          listItem.appendChild(companyText);

          // If the company has isEnabled set to false, shade in gray and add "DISABLED"
          if (!company.isEnabled) {
            listItem.style.backgroundColor = '#d3d3d3'; // light gray
            var disabledText = document.createElement('span');
            disabledText.textContent = '';
            companyText.appendChild(disabledText);
          }

          // Create the checkbox for each company
          var checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.id = 'checkboxCompany' + company._id;
          updateCheckboxStatusComp(checkbox, company.isEnabled, company._id);
          listItem.appendChild(checkbox);

          companyList.appendChild(listItem);
        }
      }
    },
    error: function () {
      alert('There was an error fetching company data.');
    },
  });
}
$('#confirmSelection').click(function () {
  companyList.innerHTML = ''; // Clears the company list
  if (matchedEntity) {
    fetchAndDisplayCompanies(matchedEntity._id);
  }
});

function updateCheckboxStatusComp(checkbox, isEnabled, regionId) {
  checkbox.checked = isEnabled;
  checkbox.onclick = function (event) {
    event.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text:
        'You are about to ' +
        (this.checked ? 'deactivate' : 'activate') +
        ' this company.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'No, keep it!',
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
      _id: regionId,
      isEnabled: isEnabled,
    }),
    success: function (response) {
      if (response.code == 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Company status updated successfully.',
        });

        // Vaciar la lista de empresas
        companyList.innerHTML = '';
        // Obtener y mostrar la nueva lista de empresas
        fetchAndDisplayCompanies(matchedEntity._id);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the company status. Please try again.',
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error updating the company status. Please try again.',
      });
    },
  });
}

$(document).ready(function () {
  //update the list to show any changes
});

// Select a company from the list
function selectCompany(tagId) {
  // 1. Remove 'selected' class from all list items
  $('#company-list li').removeClass('selected');

  // 2. Extract _id from tagId
  const companyId = tagId.replace('company', '');

  // 3. Make an AJAX request to get company data by its _id
  $.ajax({
    url: '/newcompanies/getCompanyById', // Server route where the company is retrieved by ID
    type: 'GET',
    data: { _id: companyId }, // Send the _id as a parameter
    success: function (data) {
      if (data.code == 'OK') {
        matchedCompany = data.object;

        if (matchedCompany) {
          // 4. Add 'selected' class to the list item
          $(`#${tagId}`).addClass('selected');
          console.log('company found', matchedCompany);
        } else {
          console.log('company not found in the database');
          console.log('Searched ID:', companyId);
        }
      } else {
        console.log('Error retrieving the company:', data.message);
      }
    },
    error: function () {
      console.log('Error performing the AJAX request to retrieve the company');
    },
  });
}

$(document).on('click', '#company-list li', function () {
  selectCompany(this.id);
});

// Update the entity card
$(document).ready(function () {
  $('#confirmSelection').click(function () {
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
      return; // Exit the function if the data is not valid
    }

    // Update the entity logo
    const imgElement = $('.card-img-top.current-company');
    if (!imgElement.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not find the image element.',
      });
      return; // Exit the function if the element is not found
    }
    imgElement.attr('src', entity.flag);

    // Update the name of the entity
    const nameElement = $('#company-name');
    if (!nameElement.length) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Could not find the entity name element.',
      });
      return; // Exit the function if the element is not found
    }
    nameElement.text(entity.companyName);
  }
});

// function getDeliveryOptions(){
//   $.ajax({
//     method: "GET",
//     url: "/newoptions/getDeliveryOptions",
//     success: function (response) {
//       return response;
//     },
//   })
// }

// function getVdcOptions(){
//   $.ajax({
//     method: "GET",
//     url: "/newoptions/getVdcOptions",
//     success: function (response) {
//       return response;
//     },
//   })
// }

function isValidInput(value, id) {
  if (!value) return false; // Añadido para manejar valores null o undefined

  // const allowSpacesInMiddle = [
  //   'regionClientCode',
  //   'cmdbCompany',
  //   'company',
  //   'delivery',
  //   '_id',
  //   'nicName',
  //   'shortName',
  //   'vdc',
  // ];
  // if (value.trim() !== value) return false;
  // if (!allowSpacesInMiddle.includes(id) && value.includes(" ")) return false;
  return true;
}

// Modal to edit company
$(document).ready(function () {
  function saveCompanies() {
    const parentId = $('#parentIdInput').val().trim();
    console.log(parentId);
    const entityId = $('#entityIdInput').val().trim();
    const _id = $('#_idInput').val().trim();
    const companyName = $('#companyInput').val().trim();
    const hostnamePrefix = $('#hostnamePrefixInput').val().trim();
    const regionClientCode = $('#regionClientCodeInput').val().trim();
    const delivery = $('#deliveryInput').val().trim();
    const vdc = $('#vdcInput').val().trim();
    const cmdbCompany = $('#cmdbCompanyInput').val().trim();
    const isEnabled = $('#isEnabledInputCEdit').is(':checked');

    const shortName = $('#shortNameInput').val().trim();
    const nicName = $('#nicNameInput').val().trim();
    const region = $('#regionInput').val().trim();

    // Verifies data
    if (
      !(
        _id &&
        company &&
        hostnamePrefix &&
        regionClientCode &&
        delivery &&
        vdc &&
        cmdbCompany &&
        shortName &&
        nicName &&
        region
      )
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete or Invalid Fields',
        text: 'Please complete and correct all highlighted fields.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'The new company will be added with the provided data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      // If yes, send the data to the controller
      if (result.isConfirmed) {
        // Creates the JSON object
        const newCompany = {
          parent_id: matchedEntity._id,
          Company: companyName,
          entity_id: entityId,
          _id: _id,
          Hostname_prefix: hostnamePrefix,
          Region_or_client_code: regionClientCode,
          Delivery: delivery,
          VDC: vdc,
          CMDB_company: cmdbCompany,
          isEnabled: isEnabled,
          short_name: shortName,
          nicName: nicName,
          region: region,
        }
        $.ajax({
          url: '/newcompanies/saveCompanies',
          type: 'POST',
          dataType: 'json',
          data: newCompany,
          success: function (response) {
            if (response.code === 'OK') {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Company data has been saved successfully',
              });
              $('#companyModal').modal('hide');
              $('#company-tab').tab('show');
              // Reload the table to display the new company
              //clear the list
              companyList.innerHTML = '';
              //fetch the new list

              fetchAndDisplayCompanies(matchedEntity._id);
            } else {
              console.log('Unexpected server response:', response);
            }
          },
          error: function (error) {
            if (error.status === 409) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'A company with that _id or name already exists.',
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
    // function validateField(fieldId) {
    //   const value = $(fieldId).val().trim();
    //   if (value === '' || !isValidInput(value, fieldId.replace('#', ''))) {
    //     $(fieldId).addClass('is-invalid');
    //     return false;
    //   } else {
    //     $(fieldId).removeClass('is-invalid');
    //     return value;
    //   }
    // }
  }

  // Show modal content
  function showCompanyModalContent(editCompany = false) {
    // If its editing
    var isEditing = editCompany ? true : false;
    var _idValueCompany;
    var vdcOptions;
    var deliveryOptions;
    // If its not editing, get the id from the timestamp
    if (!isEditing) {
      let currentTimestamp = new Date().getTime();
      _idValueCompany = (currentTimestamp + '').substr(1);
    }
    $.ajax({
      method: 'GET',
      url: '/newoptions/getDeliveryOptions',
      success: function (resDelivery) {
        deliveryOptions = resDelivery
          .map(
            (option) =>
              `<option ${
                editCompany.Delivery == option.id && isEditing ? 'selected' : ''
              } value="${option.id}">${option.value}</option>`,
          )
          .join('');

        $.ajax({
          method: 'GET',
          url: '/newoptions/getVdcOptions',
          success: function (resVDC) {
            vdcOptions = resVDC
              .map(
                (option) =>
                  `<option ${
                    editCompany.VDC == option.id && isEditing ? 'selected' : ''
                  }
                      value="${option.id}">${option.value}</option>`,
              )
              .join('');
            const modalContent = `
      <div class="modal-header">
          <h5 class="modal-title">${
            isEditing
              ? 'Edit Company ' + editCompany.Company
              : 'Add New Company'
          }</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <i class="fas fa-times"></i>
          </button>
      </div>
      <div class="modal-body">
          <form id="companyForm">
              <input type="hidden" id="entityIdInput" value="${
                matchedEntity ? matchedEntity.companyName : ""
              }">
              <input type="hidden" id="parentIdInput" value="${
                isEditing ? editCompany.parent_id : matchedEntity._id
              }">

              <div class="row">
                  <div class="col-md-6"> <!-- First column -->
                      <div class="form-group" hidden>
                          <label for="_idInput">Identifier:</label>
                          <input type="text" class="form-control" id="_idInput" placeholder="Enter _id" value="${
                            isEditing ? editCompany._id : _idValueCompany
                          }" ${isEditing ? 'readonly' : ''}>
                      </div>
                      <div class="form-group">
                          <label for="companyInput">Company:</label>
                          <input type="text" class="form-control" id="companyInput" placeholder="Enter company name" value="${
                            isEditing ? editCompany.Company : ''
                          }" >
                      </div>
                      <div class="form-group">
                          <label for="hostnamePrefixInput">Hostname Prefix:</label>
                          <input type="text" class="form-control" id="hostnamePrefixInput" placeholder="Enter hostname prefix" value="${
                            isEditing ? editCompany.Hostname_prefix : ''
                          }">
                      </div>
                      <div class="form-group">
                          <label for="regionClientCodeInput">Region or Client Code:</label>
                          <input type="text" class="form-control" id="regionClientCodeInput" placeholder="Enter region or client code" value="${
                            isEditing
                              ? editCompany['Region_or_client_code']
                              : ''
                          }">
                      </div>
                      <div class="form-group">
                          <label for="deliveryInput">Delivery:</label>
                          <select class="form-control" id="deliveryInput">
                          <option value="" disabled>Select a delivery option</option>
                          ${deliveryOptions}</select>
                          
                      </div>
                      <div class="form-group">
                          <label for="vdcInput">VDC:</label>
                          <select class="form-control" id="vdcInput">
                          <option value="" disabled>Select a VDC option</option>
                          ${vdcOptions}
                      </select>
                      </div>
                  </div>
                  <div class="col-md-6"> <!-- Second column -->
                      <div class="form-group">
                          <label for="cmdbCompanyInput">CMDB Company:</label>
                          <input type="text" class="form-control" id="cmdbCompanyInput" placeholder="Enter CMDB company" value="${
                            isEditing ? editCompany['CMDB_company'] : ''
                          }">
                      </div>
                      <div class="custom-control custom-checkbox">
                          <input type="checkbox" class="custom-control-input" id="isEnabledInputCEdit" ${
                            isEditing && editCompany.isEnabled ? 'checked' : ''
                          }>
                          <label class="custom-control-label" for="isEnabledInputCEdit">Enabled</label>
                      </div>

                      <div class="form-group">
                          <label for="shortNameInput">Short Name:</label>
                          <input type="text" class="form-control" id="shortNameInput" placeholder="Enter short name" value="${
                            isEditing ? editCompany.short_name : ''
                          }">
                      </div>
                      <div class="form-group">
                          <label for="nicNameInput">Nic Name:</label>
                          <input type="text" class="form-control" id="nicNameInput" placeholder="Enter Nic Name" value="${
                            isEditing ? editCompany.nicName : ''
                          }">
                      </div>
                      <div class="form-group">
                          <label for="regionInput">Region:</label>
                          <input type="text" class="form-control" id="regionInput" placeholder="Enter region" value="${
                            isEditing ? editCompany.region : ''
                          }">
                      </div>
                  </div>
              </div>
          </form>
      </div>
      <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-outline-primary" id="saveEditedCompany" value="${isEditing}">${
            isEditing ? 'Update' : 'Accept'
          }</button>
      </div>
    `;

            $('#companyModal .modal-content').html(modalContent);
            $('#companyModal').modal('show');

            // Add event listener to _idInput
            $('#_idInput').focus(function () {
              // Prevent the input from being focused
              $(this).blur();
            });

            $('#hostnamePrefixInput').on('paste', function (e) {
              var pastedData = e.originalEvent.clipboardData.getData('text');

              if (pastedData.length > 4) {
                e.preventDefault();
                Swal.fire({
                  icon: 'error',
                  title: 'Too Long',
                  text: 'You can only enter up to 4 characters for the Hostname Prefix.',
                });
              }
            });
          },
        });
      },
    });
  }
  $('#editCompanyBtn').click(function () {
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

  $('#addCompany').click(function () {
    showCompanyModalContent();
  });

  function hasChanges(updatedCompany, originalCompany) {
    return (
      updatedCompany.companyName !== originalCompany.Company ||
      updatedCompany['Hostname_prefix'] !==
        originalCompany['Hostname_prefix'] ||
      updatedCompany['Region_or_client_code'] !==
        originalCompany['Region_or_client_code'] ||
      updatedCompany.Delivery !== originalCompany.Delivery ||
      updatedCompany.VDC !== originalCompany.VDC ||
      updatedCompany['CMDB_company'] !== originalCompany['CMDB_company'] ||
      updatedCompany.isEnabled !== originalCompany.isEnabled ||
      updatedCompany.short_name !== originalCompany.short_name ||
      updatedCompany.nicName !== originalCompany.nicName ||
      updatedCompany.region !== originalCompany.region
    );
  }

  function editCompanies() {
    const parentId = $('#parentIdInput').val().trim();
    const entityId = $('#entityIdInput').val().trim();
    const _id = $('#_idInput').val().trim();
    const companyName = $('#companyInput').val().trim();
    const hostnamePrefix = $('#hostnamePrefixInput').val().trim();
    const regionClientCode = $('#regionClientCodeInput').val().trim();
    const delivery = $('#deliveryInput').val().trim();
    const vdc = $('#vdcInput').val().trim();
    const cmdbCompany = $('#cmdbCompanyInput').val().trim();
    const isEnabled = $('#isEnabledInputCEdit').is(':checked');

    const shortName = $('#shortNameInput').val().trim();
    const nicName = $('#nicNameInput').val().trim();
    const region = $('#regionInput').val().trim();

    const updatedCompany = {
      parent_id: parentId,
      entity_id: entityId,
      _id: _id,
      Company: companyName,
      Hostname_prefix: hostnamePrefix,
      Region_or_client_code: regionClientCode,
      Delivery: delivery,
      VDC: vdc,
      CMDB_company: cmdbCompany,
      isEnabled: isEnabled,

      short_name: shortName,
      nicName: nicName,
      region: region,
    };

    if (hasChanges(updatedCompany, matchedCompany)) {
      Swal.fire({
        title: 'Are you sure?',
        text: this.value
          ? 'The company will be updated with the provided data.'
          : 'The new company will be added with the provided data.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) performCompanyUpdate(updatedCompany);
      });
    } else {
      performCompanyUpdate(updatedCompany);
    }
  }
  $('#companyModal').on('click', '#saveEditedCompany', function (e) {
    e.preventDefault();
    if (this.value == 'true') editCompanies();
    else saveCompanies();
  });
  function performCompanyUpdate(updatedCompany) {
    $.ajax({
      url: `/newcompanies/edit-companies/${updateCompany._id}`,
      type: 'PUT',
      data: updatedCompany,
      success: function (response) {
        if (response.code === 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Company successfully saved',
            showConfirmButton: false,
            timer: 1500,
          });
          $('#companyEditModal').modal('hide');
          companyList.innerHTML = '';
          //fetch the new list

          fetchAndDisplayCompanies(matchedEntity._id);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error saving the company',
            text: response.message,
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Server error',
          text: 'Could not save the company. Please try again later.',
        });
      },
    });
  }
});

// Delete company
$(document).ready(function () {
  $('#deleteCompanyBtn').click(function () {
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
      text:
        'Do you really want to delete the company ' +
        matchedCompany.Company +
        '?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        performCompanyDeletion(matchedCompany._id);
      }
    });
  });

  function performCompanyDeletion(_id) {
    $.ajax({
      url: `/newcompanies/deleteCompany/${_id}`, // Assuming you send the _id in the URL
      type: 'DELETE',
      success: function (response) {
        if (response.code === 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Successfully Deleted',
            text: 'The company has been successfully deleted',
            showConfirmButton: false,
            timer: 1500,
          });
          // Optionally: update the interface to reflect the deletion
          companyList.innerHTML = '';
          //fetch the new list

          fetchAndDisplayCompanies(matchedEntity._id);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error deleting',
            text: response.message,
          });
        }
      },
      error: function () {
        Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: 'Could not delete the company. Please try again later.',
        });
      },
    });
  }
});

//confirm and go to next tab
// Confirm and go to the next tab
$(document).ready(function () {
  // Add a click event to the confirmation button
  $('#confirmCompanyBtn').click(function () {
    if (matchedCompany) {
      if (!matchedCompany.isEnabled) {
        // If the matchedCompany has isEnabled set to false, display an error message and don't proceed.
        Swal.fire({
          icon: 'error',
          title: 'Action Prohibited',
          text: 'The selected company is disabled and cannot be confirmed.',
        });
        return; // This ends the function here and won't execute the following code.
      }

      // Ask if the user really wants to confirm the selection
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: `You are about to confirm the selection of ${matchedCompany.Company}. Do you want to continue?`,
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonText: 'Yes, confirm',
      //   cancelButtonText: 'Cancel',
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     $('#region-tab').tab('show');
      //   }
      // });
      $('#region-tab').tab('show');
      // Other actions you might want to perform after confirming the selection
    } else {
      // Show a message if no company is selected
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select a company before confirming.',
      });
    }
  });
});

//
