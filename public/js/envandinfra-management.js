var matchedEnvironment;
var matchedInfrastructure;
var envList = document.getElementById('environment-list');
var infraList = document.getElementById('infrastructure-list');
function updateCard(envId, infraId) {
  // Prompt the user to confirm their selection of the region
  // Swal.fire({
  //   title: 'Are you sure?',
  //   text: `You are about to confirm the selection of ${envId} and ${infraId}. Do you want to proceed?`,
  //   icon: 'warning',
  //   showCancelButton: true, // Display a cancel button
  //   confirmButtonText: 'Yes, confirm',
  //   cancelButtonText: 'Cancel',
  // }).then((result) => {
  //   // If the user confirms, switch to the 'env-and-infra' tab
  //   if (result.isConfirmed) {
  //     $('#config-tab').tab('show');
  //     // Try to update the entity logo
  //   }
  // });
  loadOptions();
  $('#config-tab').tab('show');
}

// Function to update the entity card's content
function updateEntityCard(entities) {
  // Ensure that the entity data is complete and valid
  if (!entities.flag) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Entity data is incomplete or invalid.',
    });
    return; // Exit the function if the data is invalid
  }

  // Try to update the entity logo
  const imgElement = $('#infraIMG');
  if (!imgElement.length) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Could not find the element for the image.',
    });
    return; // Exit the function if the element is not found
  }
  imgElement.attr('src', entities.flag);

  // Refreshes the entity name
  const nameElement = $('#selectedEntityName');
  if (nameElement.length) {
    nameElement.text(entities.companyName);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Could not find the element for the entity name.',
    });
  }

  // Updates company name
  const companyNameElement = $('#company-nameEI');
  if (matchedCompany && matchedCompany.Company) {
    companyNameElement.text(matchedCompany.Company);
  } else {
    companyNameElement.text('Company not selected');
  }
  
  const regionNameElement = $('#regionName');
  if (matchedRegion && matchedRegion.Region) {
    regionNameElement.text(matchedRegion.Region);
  } else {
    regionNameElement.text('Company not selected');
  }
}
// Updates the status of the environment object
function updateEnvironmentStatusE(envId, isEnabled) {
  const url = '/newenvironments/toggleEnvironmentsStatus';
  console.log(
    'Updating environment with ID:',
    envId,
    'New status:',
    isEnabled,
    'With Parent ID:',
    matchedRegion._id,
  );

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      _id: envId,
      parent_id: matchedRegion._id,
      isEnabled: isEnabled,
    }),
    success: function (response) {
      if (response.code == 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Environment status updated successfully.',
        });
        const listItem = $('#environment' + envId);
        listItem.css('background-color', isEnabled ? '' : '#d3d3d3');
        listItem.children('input')[0].checked = isEnabled;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the environment status.',
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error updating the environment status.',
      });
    },
  });
}
// Display the environments objects from the catalog
function displayEnvironmentsFromCatalog() {
  $.ajax({
    url: '/newenvironments/obtenerEnvironments',
    type: 'GET',
    dataType: 'json',
    success: function (activeData) {
      if (activeData.code !== 'OK') {
        return Swal.fire({
          icon: 'error',
          title: 'Server Error',
          text: activeData.message,
        });
      }

      const activeEnvironments = activeData.object;

      $.ajax({
        url: '/newenvironments/obtenerCatalogoEnviroments',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data.code !== 'OK') {
            return Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: data.message,
            });
          }
          envList.innerHTML = '';
          data.object.forEach(function (env) {
            let listItem = $('<li>')
              .addClass(
                'list-group-item d-flex justify-content-between align-items-center env-object',
              )
              .attr('id', 'environment' + env._id);

            let envText = $('<span>').text(env.EnvName);
            listItem.append(envText);

            let isActive = false; // Valor predeterminado
            if (activeEnvironments) {
              isActive = activeEnvironments.some(
                (actEnv) =>
                  actEnv._id === env._id &&
                  actEnv.parent_id === matchedRegion._id,
              );
              listItem.css('background-color', isActive ? '' : '#d3d3d3');
            }

            let checkbox = $('<input>')
              .attr('type', 'checkbox')
              .prop('checked', isActive);

            // Checkbox function
            checkbox.on('click', function (event) {
              event.preventDefault();
              Swal.fire({
                title: 'Are you sure?',
                text:
                  'You are about to ' +
                  (this.checked ? 'activate' : 'deactivate') +
                  ' this environment.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, keep it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  updateEnvironmentStatusE(env._id, !this.checked);
                }
              });
            });

            listItem.append(checkbox);
            $('#environment-list').append(listItem);
          });
        },
        error: function () {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch environments.',
          });
        },
      });
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to fetch active environments.',
      });
    },
  });
}
// When clicking an environment object, fetch the infrastructures from the catalog
$(document).on('click', 'li.env-object', (event) => {
  matchedEnvironment = event.currentTarget.id.replace('environment', '');
  event.preventDefault();
  $.ajax({
    url: '/newinfrastructure/obtenerInfraestructuras',
    type: 'GET',
    success: (data) => {
      const activeInfrastructures = data.object;

      $.ajax({
        url: '/newinfrastructure/obtenerCatalogoInfraestructuras',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
          if (data.code !== 'OK') {
            return Swal.fire({
              icon: 'error',
              title: 'Server Error',
              text: data.message,
            });
          }
          infraList.innerHTML = '';
          data.object.forEach(function (infra) {
            let listItem = $('<li>')
              .addClass(
                'list-group-item d-flex justify-content-between align-items-center infra-object',
              )
              .attr('id', 'infrastructure' + infra._id);

            let infraText = $('<span>').text(infra.infraName);
            listItem.append(infraText);

            let isActive = false; // Valor predeterminado
            if (activeInfrastructures) {
              isActive = activeInfrastructures.some(
                (actInfra) =>
                  actInfra._id === infra._id &&
                  actInfra.parent_id === matchedEnvironment &&
                  actInfra.region_id === matchedRegion._id,
              );
              listItem.css('background-color', isActive ? '' : '#d3d3d3');
            }

            let checkbox = $('<input>')
              .attr('type', 'checkbox')
              .prop('checked', isActive);

            // Checkbox function
            checkbox.on('click', function (event) {
              event.preventDefault();
              Swal.fire({
                title: 'Are you sure?',
                text:
                  'You are about to ' +
                  (this.checked ? 'activate' : 'deactivate') +
                  ' this infrastructure.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, change it!',
                cancelButtonText: 'No, keep it!',
              }).then((result) => {
                if (result.isConfirmed) {
                  updateInfrastructureStatus(infra._id, !this.checked);
                }
              });
            });

            listItem.append(checkbox);
            $('#infrastructure-list').append(listItem);
          });
        },
        error: function () {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to fetch environments.',
          });
        },
      });
    },
    error: (data) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to get infrastructures.',
      });
    },
  });
});
// When clicking the checkbox, change the status of the infrastructure object
function updateInfrastructureStatus(infraId, isEnabled) {
  const url = '/newinfrastructure/toggleInfrastructureStatus';
  console.log(
    'Updating infrastructure with ID:',
    infraId,
    'New status:',
    isEnabled,
    'With Parent ID:',
    matchedEnvironment,
  );

  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({
      _id: infraId,
      parent_id: matchedEnvironment,
      region_id: matchedRegion._id,
      isEnabled: isEnabled,
    }),
    success: function (response) {
      if (response.code == 'OK') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Infrastructure status updated successfully.',
        });
        const listItem = $('#infrastructure' + infraId);
        listItem.css('background-color', isEnabled ? '' : '#d3d3d3');
        listItem.children('input')[0].checked = isEnabled;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update the infrastructure status.',
        });
      }
    },
    error: function () {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'There was an error updating the infrastructure status.',
      });
    },
  });
}
// When clicking an infrastructrue object, save the ID of the selected infrastructure
$(document).on('click', 'li.infra-object', (event) => {
  event.preventDefault();
  matchedInfrastructure = event.currentTarget.id.replace('infrastructure', '');
});

// Check if the selection is disabled
// If it is, display an error message and abort the operation
function checkIfSelectionDisabled() {
  if (
    !$(document)
      .find('#environment' + matchedEnvironment)
      .children('input')[0].checked ||
    !$(document)
      .find('#infrastructure' + matchedInfrastructure)
      .children('input')[0].checked
  )
    return false;

  return true;
}

$(document).ready(function () {
  // When the user clicks the 'Confirm' button, check if an environment and an infrastructure have been selected
  $('#confirmInfraAndEnvnBtn').on('click', function (e) {
    e.preventDefault();
    if (!matchedEnvironment || !matchedInfrastructure) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before confirming.',
      });
      return;
    }
    if (!checkIfSelectionDisabled()) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select an active environment and/or infrastructure.',
      });
      return;
    }
    updateCard(matchedEnvironment, matchedInfrastructure);
  });
});
