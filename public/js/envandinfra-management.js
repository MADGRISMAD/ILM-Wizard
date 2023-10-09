var matchedEnvironment;
var matchedInfrastructure;
var envList = document.getElementById('environment-list');
var infraList = document.getElementById('infrastructure-list');
function updateCard(envId, infraId) {
  // Prompt the user to confirm their selection of the region
  Swal.fire({
    title: 'Are you sure?',
    text: `You are about to confirm the selection of ${envId} and ${infraId}. Do you want to proceed?`,
    icon: 'warning',
    showCancelButton: true, // Display a cancel button
    confirmButtonText: 'Yes, confirm',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    // If the user confirms, switch to the 'env-and-infra' tab
    if (result.isConfirmed) {
      $('#config-tab').tab('show');
          // Try to update the entity logo
    }
  });


  // Actualiza el logo de la entidad
  const imgElement = $('#infraIMG');
  if (imgElement.length) {
    imgElement.attr('src', entities.flag);
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Could not find the element for the image.',
    });
    imgElement.attr("src", entities.flag);
  }

  // Actualiza el nombre de la entidad
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

  // Actualiza el nombre de la compañía
  const companyNameElement = $('#company-nameEI');
  if (matchedCompany && matchedCompany.Company) {
    companyNameElement.text(matchedCompany.Company);
  } else {
    companyNameElement.text('Company not selected');
  }
}

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
        listItem.css(
          'background-color',
          isEnabled ? '#colorForActivated' : '#d3d3d3',
        );
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
            }

            let checkbox = $('<input>')
              .attr('type', 'checkbox')
              .prop('checked', isActive);

            // Función del checkbox
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
                  this.checked = !this.checked;
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
            }

            let checkbox = $('<input>')
              .attr('type', 'checkbox')
              .prop('checked', isActive);

            // Función del checkbox
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
                  this.checked = !this.checked;
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
        listItem.css(
          'background-color',
          isEnabled ? '#colorForActivated' : '#d3d3d3',
        );
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

$(document).on('click', 'li.infra-object', (event) => {
  event.preventDefault();
  matchedInfrastructure = event.currentTarget.id.replace('infrastructure', '');
});

$(document).ready(function () {
  $('#confirmInfraAndEnvnBtn').on('click', function (e) {
    e.preventDefault();
    console.log(!matchedEnvironment || !matchedInfrastructure);
    if (!matchedEnvironment || !matchedInfrastructure) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before confirming.',
      });
    } else updateCard(matchedEnvironment, matchedInfrastructure);
  });
});
