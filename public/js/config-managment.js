// List of configuration titles
const VMWareConfigs = [
  ['Other Software', 'multiList', 'otherSoftwareProducts'],
  ['HA', 'list', 'haList'],
  ['Site', 'addList', 'sites'],
  ['Network Type', 'list', 'networkTypes'],
  ['Bridge Domain', 'list', 'bridgeDomains', 'networkTypes', 'ACI'],
  ['Distribution', 'addList', 'distributions'],
  ['Available Deployment', 'checkbox', 'availableDeployment'],
];

const OHEConfigs = [
  ['Other Software', 'multiList', 'otherSoftwareProducts'],
  ['HA', 'list', 'haList'],
  ['Business Service', 'addList', 'businessServices'],
  ['Cluster Class', 'list', 'clusterClasses'],
  ['Business Type', 'list', 'businessTypes'],
  ['Service Class', 'list', 'serviceClasses'],
  ['Cluster Type', 'list', 'clusterTypes', 'serviceClasses'],
  ['Availabitity Set', 'list', 'availabilitySets', 'serviceClasses', 'Gold'],
  ['AZ', 'list', 'availabilityZones', 'clusterTypes'],
  ['Network', 'list', 'network'],
  ['Deployable in Alexa', 'checkbox', 'deployableInAlexa'],
  ['Available Deployment', 'checkbox', 'availableDeployment'],
];
function loadOptions() {
  $('#configDropdownContainer').empty();
  const container = document.getElementById('configDropdownContainer');

  // Adding title and subtitle
  const title = document.createElement('h2');
  title.textContent = 'Derived Configurations';
  container.appendChild(title);

  const subtitle = document.createElement('p');
  subtitle.textContent = 'Choose the appropriate option';
  container.appendChild(subtitle);

  var configs;

  if (matchedInfrastructure == 'vmware') configs = VMWareConfigs;
  else configs = OHEConfigs;
  const url = matchedInfrastructure == 'vmware' ? '/vmware' : '/ohe';
  $.ajax({
    url: '/newConfig/getConfigs' + url,
    type: 'GET',
    success: function (resp) {
      for (let i = 0; i < configs.length; i += 3) {
        const row = document.createElement('div');
        row.classList.add('form-row', 'mb-4');

        for (let j = 0; j < 3 && i + j < configs.length; j++) {
          const col = document.createElement('div');
          col.classList.add('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');
          const title = configs[i + j][0];
          const type = configs[i + j][1];
          const configName = configs[i + j][2] || false;
          const parent = configs[i + j][3] || false;
          const parentValue = configs[i + j][4] || false;
          const label = document.createElement('label');

          if (parent) col.setAttribute('style', 'display:none');
          label.textContent = title;
          col.appendChild(label);

          const element = document.createElement('div');
          element.classList.add(
            'd-flex',
            'align-items-center',
            'dropdown-container',
          );
          element.setAttribute('id', 'configList');
          if (type == 'list' || type == 'addList' || type == 'multiList') {
            const select = document.createElement('select');
            select.classList.add('form-control', 'with-button');
            if (type == 'multiList') select.setAttribute('multiple', true);

            for (let k = -1; k < resp.object[configName].length; k++) {
              const option = document.createElement('option');
              const config = k === -1 ? title : resp.object[configName][k];

              // Marks a first option as disabled and selected
              if (k === -1) {
                option.textContent = title;
                option.setAttribute('disabled', true);
                option.setAttribute('selected', true);
              } else if (typeof config === 'object') {
                // Creates options with values of the JSON
                option.textContent = config.value
                  ? config.value
                  : config.companlyAlias;
              } else {
                // if its not object, use the value as text
                option.textContent = config;
              }
              select.append(option);
            }
            // Sets the id
            select.setAttribute('id', configName);

            // If it has a parent, creates a listener to enable/disable the select
            if (parent) {
              console.log(parent, parentValue);
              select.setAttribute('disabled', true);
              $(document).on('change', '#' + parent, function () {
                // If it has a parent value to enable, enable it
                if (!parentValue || $(this).val() == parentValue)
                  select.removeAttribute('disabled');
                if (parentValue && $(this).val() != parentValue) {
                  select.setAttribute('disabled', true);
                  $('#' + configName).val(
                    $('#' + configName + ' option:first').val(),
                  );
                }
              });
            }
            // Appends the element to the container
            element.appendChild(select);
            //   Creates the modify button its an addList
            if (type == 'addList') {
              const button = document.createElement('button');
              button.classList.add('btn', 'btn-secondary', 'config-button');
              button.innerHTML = '<i class="fas fa-cog"></i>';
              element.appendChild(button);
            }
            // Creates the checkbox if its a checkbox
          } else if (type == 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', configName);
            checkbox.setAttribute('value', configName);
            element.appendChild(checkbox);
          }
          col.appendChild(element);
          row.appendChild(col);
        }

        container.appendChild(row);

        if (i === 0) {
          const divider = document.createElement('hr');
          container.appendChild(divider);
        }
      }
    },
  });

  // Styles
  const style = document.createElement('style');
  style.innerHTML = `
          .dropdown-container .form-control.with-button {
              padding-right: 2.5rem;
          }
          .config-button {
              position: absolute;
              right: 0.5rem;
              z-index: 2;
              border-left: 1px solid #ccc;
              background-color: white;
              color: #333;
              border-color: #ccc;
          }
          .config-button:hover {
              background-color: #F06166;
              color: white;
          }
      `;
  document.head.appendChild(style);

  // Modal HTML
  const modalHTML = `
          <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                          <h5 class="modal-title" id="editModalLabel">Edit Option</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div class="modal-body">
                          <input type="text" class="form-control" id="editInput" placeholder="Edit option...">
                      </div>
                      <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" id="saveChanges">Save changes</button>
                      </div>
                  </div>
              </div>
          </div>
      `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Edit Modal Event
  document.addEventListener('click', function (event) {
    if (event.target.classList.contains('config-button')) {
      const parentDiv = event.target.parentNode;
      const selectElement = parentDiv.querySelector('select');
      const inputElement = parentDiv.querySelector('input');

      
      let currentValue;
      if (selectElement) {
        currentValue = selectElement.options[selectElement.selectedIndex].text;
      } else if (inputElement) {
        currentValue = inputElement.value;
      }

      document.getElementById('editInput').value = currentValue;
      $('#editModal').modal('show');
    }
  });

  // Save Changes Event
  document.getElementById('saveChanges').addEventListener('click', function () {
    const newValue = document.getElementById('editInput').value;
    const activeConfigButton = document.querySelector('.config-button:focus');

    if (activeConfigButton) {
      const parentDiv = activeConfigButton.parentNode;
      const selectElement = parentDiv.querySelector('select');
      const inputElement = parentDiv.querySelector('input');

      if (selectElement) {
        const selectedOption =
          selectElement.options[selectElement.selectedIndex];
        selectedOption.textContent = newValue;
        selectedOption.value = newValue.toLowerCase().replace(/ /g, '_');
      } else if (inputElement) {
        inputElement.value = newValue;
      }
    }

    $('#editModal').modal('hide');
  });
  $('#confirmConfig').on('click', function (e) {
    e.preventDefault();
    
    const valid = validateInputs();
    console.log("Entra", valid);
    var data = getValues();
    if (valid) {
        
    } else {
      Swal.fire({
        title: 'error',
        title: 'Oops...',
        text: 'Please fill all the fields',
      });
    }
    return;
  });

//   Gets the values of the inputs
  function getValues() {
    var data = [];
    const config = matchedInfrastructure ? VMWareConfigs : OHEConfigs;
    for (let i = 0; config.length; i++) {
      const id = '#' + config[i][2];
      const type = config[i][1];
      if (type == 'list' || type == 'addList' || type == 'multiList')
        if ($(id).selectedIndex == 0 && !$(id).is(':disabled')) {
          $(id).addClass('error-input');
          return false;
        }
      data.push($(id).val());
      if (type == 'checkbox') data.push($(id).is(':checked'));

      return true;
    }
  }
//   Validates the inputs if they are empty
  function validateInputs() {
    const config = matchedInfrastructure =='vmware' ? VMWareConfigs : OHEConfigs;
    var validated = true;
    for (let i = 0; i < config.length; i++) {
      const id = '#' + config[i][2];
      const type = config[i][1];
      if (type == 'list' || type == 'addList' || type == 'multiList'){
        console.log($(id)[0].selectedIndex);
        if ($(id)[0].selectedIndex == 0 && !$(id).is(':disabled')) {
          $(id).addClass('error-input');
          validated = false;
        }
        else
            $(id).removeClass('error-input');
      }
        
      if (type == 'checkbox') console.log($(id).is(':checked')	);
    }
    return validated;
  }
}
