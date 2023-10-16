// List of configuration titles
const VMWareConfigs = [
  ['Other Software', 'multiList', 'otherSoftwareProducts'],
  ['HA', 'list', 'haList'],
  ['Network Type', 'list', 'networkTypes'],
  ['Site', 'addList', 'sites'],
  ['Distribution', 'addList', 'distributions', { parent: 'sites' }],
  [
    'Bridge Domain',
    'list',
    'bridgeDomains',
    { parent: 'distributions', parentValue: 'ACI', url: '/newconfig/getBD' },
  ],
  ['Available Deployment', 'checkbox', 'availableDeployment'],
  ['Deployable in ILM', 'checkbox', 'deployableInILM'],
  ['Deployable in Alexa', 'checkbox', 'deployableInAlexa', { disabled: true }],
];

const OHEConfigs = [
  ['Other Software', 'multiList', 'otherSoftwareProducts'],
  ['HA', 'list', 'haList'],
  ['Business Service', 'addList', 'businessServices'],
  ['Cluster Class', 'list', 'clusterClasses'],
  ['Business Type', 'list', 'businessTypes'],
  ['Network', 'list', 'network'],
  ['Service Class', 'list', 'serviceClasses'],
  [
    'Availabitity Set',
    'list',
    'availabilitySets',
    { parent: 'serviceClasses', parentValue: 'Gold' },
  ],
  ['Cluster Type', 'list', 'clusterTypes', { parent: 'serviceClasses' }],
  [
    'AZ',
    'list',
    'availabilityZones',
    { parent: 'clusterTypes', url: '/newconfig/getAZ', default: true },
  ],

  ['Available Deployment', 'checkbox', 'availableDeployment'],
  ['Deployable in ILM', 'checkbox', 'deployableInILM'],
  ['Deployable in Alexa', 'checkbox', 'deployableInAlexa'],
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
  var checkboxes = false;
  // Use vmware configs if the infrastructure is vmware
  if (matchedInfrastructure == 'vmware') configs = VMWareConfigs;
  // Else use OHE configs
  else configs = OHEConfigs;
  const url = matchedInfrastructure == 'vmware' ? '/vmware' : '/ohe';

  $.ajax({
    url: '/newConfig/getConfigs' + url,
    type: 'GET',

    success: function (resp) {
      // Creates rows every 3 inputs
      for (let i = 0; i < configs.length; i += 3) {
        var row = document.createElement('div');
        row.classList.add('form-row', 'mb-4');
        // Creates 3 inputs per row
        for (let j = 0; j < 3 && i + j < configs.length; j++) {
          const col = document.createElement('div');
          col.classList.add('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');
          const title = configs[i + j][0];
          const type = configs[i + j][1];
          const configName = configs[i + j][2] || false;
          const options = configs[i + j][3] || false;
          const parent = options.parent || false;
          const parentValue = options.parentValue || false;
          const label = document.createElement('label');
          // Creates a new row if its a checkbox (checkbox section)
          if (type == 'checkbox' && !checkboxes) {
            row.appendChild(col);
            container.appendChild(row);
            row = document.createElement('div');
            row.classList.add('form-row', 'mb-4');
            addDivider(container);
            checkboxes = true;
          }

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
              select.setAttribute('disabled', true);
              $(document).on('change', '#' + parent, function () {
                // If it has a parent value to enable, enable it
                if (!parentValue || $(this).val() == parentValue) {
                  select.removeAttribute('disabled');
                  const url = options.url || false;
                  if (options.url) {
                    var data = {};
                    const parentValue = $('#' + parent).val();
                    $.extend(data, { [parent]: parentValue });

                    for (let l = 0; l < configs.length; l++) {
                      if (configs[l][2] == parent) {
                        const parentParent = configs[l][3].parent;
                        $.extend(data, {
                          [parentParent]: $('#' + parentParent).val(),
                        });
                      }
                    }
                    console.log(data);
                    $.ajax({
                      method: 'post',
                      url: url,
                      data: data,
                      success: function (res) {
                        const object = res.object;
                        $('#' + configName).html('');
                        const option = document.createElement('option');
                        option.textContent = title;
                        option.setAttribute('disabled', true);
                        option.setAttribute('selected', true);
                        $('#' + configName).append(option);
                        for (let m = 0; m < object.length; m++) {
                          const option = document.createElement('option');
                          option.textContent = object[m].value;
                          option.value = object[m].value;

                          if (options.default && object[m].default) {
                            option.setAttribute('selected', true);
                          }
                          $('#' + configName).append(option);
                        }
                      },
                    });
                  }
                }

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
            //   Creates the modify button if its an addList
            if (type == 'addList') {
              const button = document.createElement('button');
              button.classList.add('btn', 'btn-secondary', 'config-button');
              button.innerHTML = '<i class="fas fa-cog"></i>';
              button.setAttribute('value', configName);
              if(parent) button.setAttribute('disabled', true);
              element.appendChild(button);
            }
            // Creates the checkbox if its a checkbox
          } else if (type == 'checkbox') {
            const checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('id', configName);
            checkbox.setAttribute('value', configName);
            if (options.disabled) checkbox.setAttribute('disabled', true);

            element.appendChild(checkbox);
          }
          col.appendChild(element);
          row.appendChild(col);
        }

        container.appendChild(row);

        if (i === 0) {
          addDivider(container);
        }
      }
    },
  });

  const addDivider = (container) => {
    const divider = document.createElement('hr');
    container.appendChild(divider);
  };

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
                          <table class="table">
                          <thead>
                            <tr>
                              <th scope="col" hidden>Id</th>
                              <th scope="col">Option</th>
                              <th scope="col">Enabled</th>
                              <th scope="col">Actions...</th>
                            </tr>
                          </thead>
                          <tbody>
                          </tbody>
                          </table>
                          <button type="button" class="btn btn-primary" id="addOption">Add Option</button>
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
  $(document).on('click', '.config-button', function (event) {
    event.preventDefault();
    $('#editmodal .modal-footer #saveChanges').attr('value', this.value);
    $.ajax({
      url: '/newConfig/getCustomConfigs/' + this.value,
      type: 'GET',
      success: function (res) {
        const object = res.object || [];
        console.log(object);
        const tbody = $('#editModal tbody');
        tbody.html('');
        for (let i = 0; i < object.length; i++) {
          const element = object[i];
          if(element.envId === matchedEnvironment && element.regionId === matchedRegion._id && element.envId === matchedInfrastructure)
            continue;
          const tr = createRow(
            element.identifier,
            element.name,
            element.isEnabled,
          );
          tbody.append(tr);
        }
      },
    });
    const createRow = (id = Date.now(), name = '', isEnabled = false) => {
      const tr = $('<tr></tr>');
      const tdId = $('<td hidden></td>');
      const tdOption = $('<td></td>');
      const tdEnabled = $('<td></td>');
      const tdActions = $('<td></td>');

      const checkbox = document.createElement('input');
      checkbox.setAttribute('type', 'checkbox');
      checkbox.setAttribute('id', id);
      checkbox.setAttribute('value', id);
      if (isEnabled) checkbox.setAttribute('checked', true);

      // const editButton = document.createElement('button');
      // editButton.setAttribute('type', 'button');
      // editButton.setAttribute('class', 'btn btn-primary');
      // editButton.setAttribute('data-toggle', 'modal');
      // editButton.setAttribute('data-target', '#editModal');
      // editButton.setAttribute('data-id', object[i].identifier);
      // editButton.innerHTML = '<i class="fas fa-edit"></i>';

      const deleteButton = document.createElement('button');
      deleteButton.setAttribute('type', 'button');
      deleteButton.setAttribute('class', 'btn btn-danger');
      deleteButton.setAttribute('data-toggle', 'modal');
      deleteButton.setAttribute('data-target', '#editModal');
      deleteButton.setAttribute('data-id', id);
      deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';

      tdId.attr('hidden', true);
      tdId.text(id);
      tdOption.text(name);
      tdEnabled.append(checkbox);
      // tdActions.append(editButton);
      tdActions.append(deleteButton);

      tr.append(tdId, tdOption, tdEnabled, tdActions);

      return tr;
    };
    $(document).on('click', '#addOption', (e) => {
      e.preventDefault();
      const tbody = $('#editModal tbody');
      const tr = createRow();

      tbody.append(tr);
    });
    // Makes the name capable of editing
    $('#editModal tbody').on('click', 'td:nth-child(2)', function () {
      const input = $('<input></input>');
      input.val($(this).text());
      $(this).html(input);
      input.focus();
    });

    // When clicking outside the input, it becomes a text again
    $('#editModal tbody').on('focusout', 'td:nth-child(2) input', function () {
      const input = $(this);
      const td = $(this).parent();
      td.text(input.val());
    });

    // When clicking the delete button, it deletes the row
    $('#editModal tbody').on('click', 'td:nth-child(4) button', function () {
      const tr = $(this).parent().parent();
      tr.remove();
    });

    // if (event.target.classList.contains('config-button')) {
    //   const parentDiv = event.target.parentNode;
    //   const selectElement = parentDiv.querySelector('select');
    //   const inputElement = parentDiv.querySelector('input');

    //   let currentValue;
    //   if (selectElement) {
    //     currentValue = selectElement.options[selectElement.selectedIndex].text;
    //   } else if (inputElement) {
    //     currentValue = inputElement.value;
    //   }

    // document.getElementById('editInput').value = currentValue;

    $('#saveChanges').attr('value', this.value);
    $('#editModal').modal('show');
  });

  // Save Changes Event
  document.getElementById('saveChanges').addEventListener('click', function () {
    var data = [];
    // For every row in the table, it gets the values and creates a JSON
    $('#editModal tbody tr').each(function () {
      const id = $(this).find('td:nth-child(1)').text();
      const name = $(this).find('td:nth-child(2)').text();
      const enabled = $(this).find('td:nth-child(3) input').is(':checked');
      const object = {
        identifier: id,
        name: name,
        isEnabled: enabled,
        envId: matchedEnvironment,
        infId: matchedInfrastructure,
        regionId: matchedRegion._id,
      };
      data.push(object);
    });
    const url =
      '/newConfig/setCustomConfigs/' + $('#saveChanges').attr('value');
    $.ajax({
      url: url,
      type: 'PUT',
      data: {data: JSON.stringify(data)},
      dataType: 'json',
      success: function (res) {
        Swal.fire({
          title: 'Success',
          text: 'The options has been updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
      },
    });

    $('#editModal').modal('hide');
  });

  const loadOptions = () => {};

  $('#confirmConfig').on('click', function (e) {
    e.preventDefault();

    const valid = validateInputs();
    console.log('Entra', valid);
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
    const config =
      matchedInfrastructure == 'vmware' ? VMWareConfigs : OHEConfigs;
    var validated = true;
    for (let i = 0; i < config.length; i++) {
      const id = '#' + config[i][2];
      const type = config[i][1];
      if (type == 'list' || type == 'addList' || type == 'multiList') {
        if ($(id)[0].selectedIndex == 0 && !$(id).is(':disabled')) {
          $(id).addClass('error-input');
          validated = false;
        } else $(id).removeClass('error-input');
      }

      if (type == 'checkbox') console.log($(id).is(':checked'));
    }
    return validated;
  }
}
