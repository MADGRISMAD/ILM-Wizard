const DEFAULTMESSAGE = 'Select an option';

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
    { parent: 'networkTypes', parentValue: 'ACI' },
  ],
  ['Available Deployment', 'checkbox', 'availableDeployment'],
  ['Deployable in ILM', 'checkbox', 'deployableInILM'],
  ['Deployable in Alexa', 'checkbox', 'deployableInAlexa', { disabled: true }],
];

const OHEConfigs = [
  ['Other Software', 'multiList', 'otherSoftwareProducts'],
  ['HA', 'list', 'haList'],
  ['Business Service', 'list', 'businessServices'],
  ['Cluster Class', 'list', 'clusterClasses', { editable: true }],
  ['Business Type', 'list', 'businessTypes', { editable: true }],
  ['Network', 'addList', 'network'],
  ['Service Class', 'list', 'serviceClasses', { editable: true }],
  [
    'Availabitity Set',
    'list',
    'availabilitySets',
    { parent: 'serviceClasses', parentValue: 'Gold', editable: true },
  ],
  ['Cluster Type', 'list', 'clusterTypes', { parent: 'serviceClasses' }],
  [
    'AZ',
    'list',
    'availabilityZones',
    { parent: 'clusterTypes', default: true },
  ],

  ['Available Deployment', 'checkbox', 'availableDeployment'],
  ['Deployable in ILM', 'checkbox', 'deployableInILM'],
  ['Deployable in Alexa', 'checkbox', 'deployableInAlexa'],
];
function loadOptions() {
  $('#configDropdownContainer').empty();
  const container = $('#configDropdownContainer');

  // Adding title and subtitle
  const title = $('<h2></h2>');
  title.text('Derived Configurations');
  container.append(title);

  const subtitle = $('<p></p>');
  subtitle.text('Choose the appropriate option');
  container.append(subtitle);

  var configs;
  var checkboxes = false;
  // Use vmware configs if the infrastructure is vmware
  if (matchedInfrastructure == 'vmware') configs = VMWareConfigs;
  // Else use OHE configs
  else configs = OHEConfigs;
  HelperService.postRequest(
    '/newConfig/getConfigs',
    {
      envId: matchedEnvironment,
      infId: matchedInfrastructure,
      regionId: matchedRegion._id,
    },
    function (resp) {
      // Creates rows every 3 inputs
      for (let i = 0; i < configs.length; i += 3) {
        var row = $('<div></div>');
        row.addClass('form-row', 'mb-4');
        // Creates 3 inputs per row
        for (let j = 0; j < 3 && i + j < configs.length; j++) {
          const col = $('<div></div>');
          col.addClass('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');
          const title = configs[i + j][0];
          const type = configs[i + j][1];
          const configName = configs[i + j][2] || false;
          const options = configs[i + j][3] || false;
          const editable = options.editable || false;
          const parent = options.parent || false;
          const parentValue = options.parentValue || false;
          const label = document.createElement('label');
          label.classList.add('mt-2');
          // Creates a new row if its a checkbox (checkbox section)
          if (type == 'checkbox' && !checkboxes) {
            row.append(col);
            container.append(row);
            row = $('<div></div>');
            row.addClass('form-row mb-4');
            addDivider(container);
            checkboxes = true;
          }
          label.textContent = title;
          col.append(label);

          const element = $('<div> </div>');
          element.addClass('d-flex align-items-center dropdown-container');
          element.attr('id', 'configList');
          if (type == 'list' || type == 'addList' || type == 'multiList') {
            const select = $('<select></select>');
            if (type === 'multiList') select.attr('multiple', true);
            select.addClass(
              'form-control with-button d-flex align-self-center my-1',
            );
            // Creates the options
            const firstOption = $('<option></option>');
            firstOption.text(DEFAULTMESSAGE);
            firstOption.attr('disabled', true);
            if (type != 'multiList') firstOption.attr('selected', true);
            select.append(firstOption);

            for (let k = 0; k < resp.object[configName].length; k++) {
              const option = $('<option></option>');
              const config = resp.object[configName][k];

              const envId = config.envId || false;
              const infId = config.infId || false;
              const regionId = config.regionId || false;

              if (
                (envId || infId || regionId) &&
                (envId != matchedEnvironment ||
                  infId != matchedInfrastructure ||
                  regionId != matchedRegion._id)
              )
                continue;
              // Creates options with values of the JSON
              option.val(config.identifier);
              option.text(config.value ? config.value : config.companlyAlias);

              if (!config.isEnabled) option.attr('disabled', true);
              select.append(option);
            }

            // Sets the id
            select.attr('id', configName);

            // If it has a parent, creates a listener to enable/disable the select
            if (parent) {
              select.attr('disabled', true);
              $(document).on('change', '#' + parent, function (e) {
                e.preventDefault();
                if (type == 'multiList') select.attr('multiple', true);
                
                // If it has a parent value to enable, enable it
                if (!parentValue || $(this).val() == parentValue) {
                  select.removeAttr('disabled');
                  const parentSelect = $(e.target);
                  const parentValue = parentSelect.val();
                  const properties = {
                    envId: matchedEnvironment,
                    infId: matchedInfrastructure,
                    regionId: matchedRegion._id,
                    parentId: parentValue,
                  };
                  loadSelect(select, configName, properties);
                  select.attr('parentId', parentValue);
                  select.select2(SELECT2CONFIG);
                }
                if (parentValue && $(this).val() != parentValue) {
                  select.attr('disabled', true);
                  $('#' + configName).val(
                    $('#' + configName + ' option:first').val(),
                  );
                }
              });
            }
            // Appends the element to the container
            element.append(select);
            select.select2(SELECT2CONFIG);

            // Creates a listener to enable/disable the option when you click the checkbox
            select.on('select2:select', function (e) {
              const triggerElement = e.params.originalEvent.target;
              const element = $(triggerElement);
              const select = $(this);
              // When the input trigger
              if (element.attr('type') == 'checkbox') {
                e.preventDefault();
                const url =
                  '/newConfig/toggleCustomConfig/' + select.attr('id');
                HelperService.postRequest(
                  url,
                  {
                    value: element.attr('id'),
                  },
                  function (res) {
                    if (!res) {
                      element.parent('option').attr('disabled', true);
                      select.select2(SELECT2CONFIG);
                    } else element.parent('option').attr('disabled', false);
                    select.select2(SELECT2CONFIG);
                    console.log('Chido');
                  },
                  function (err) {
                    console.log('Mal' + err);
                  },
                );
              }
              // When the span triggers
              else console.log('Sigue');
            });

            //   Creates the modify button if its an addList
            if (type == 'addList') {
              const button = $('<button></button>');
              button.addClass('btn btn-secondary config-button');
              button.html('<i class="fas fa-cog"></i>');
              button.attr('value', configName);
              button.attr('parentId', parent);
              // If it has a parent, disable the button
              if (parent) {
                button.attr('disabled', false);
                // Creates a listener to enable/disable the button when the parent changes
                $(document).on('change', '#' + parent, function () {
                  if (!parentValue || $(this).val() == parentValue) {
                    button.removeAttr('disabled');
                  } else {
                    button.attr('disabled', true);
                  }
                });
              }
              element.append(button);
            }
            // Creates the checkbox if its a checkbox
          } else if (type == 'checkbox') {
            const checkbox = $('<input></input>');
            checkbox.attr('type', 'checkbox');
            checkbox.attr('id', configName);
            checkbox.attr('value', configName);
            if (options.disabled) checkbox.attr('disabled', true);

            element.append(checkbox);
          }
          col.append(element);
          row.append(col);
        }

        container.append(row);

        if (i === 0) {
          addDivider(container);
        }
      }
    },
    function (err) {
      alert(err);
    },
  );

  const templateResult = (state) => {
    if (state.text == DEFAULTMESSAGE) {
      return $(`<span class="d-flex">
      <span  class="d-flex w-100 align-self-center">${state.text}</span>
      </span>`);
    }

    const template = $(
      `<span class="d-flex">
      <span  class="d-flex w-100 align-self-center">${state.text}</span>
      <input type = "checkbox" class="d-flex flex-shrink-1 align-self-center toggleEnable"  id = '${state.id}' value = '${state.text}'>
        </span>`,
    );
    template.children('input').prop('checked', !state.disabled);
    return template;
  };
  const addDivider = (container) => {
    const divider = $('<hr></hr>');
    container.append(divider);
  };

  const loadSelect = (select, id, properties) => {
    select.html('');
    const parentId = properties.parentId || '';
    HelperService.postRequest(
      '/newConfig/getCustomConfigs/' + id + '/' + parentId,
      { ...properties },
      function (res) {
        const object = res.object;
        for (let i = -1; i < object.length; i++) {
          const option = $('<option></option>');
          const config = i === -1 ? DEFAULTMESSAGE : object[i].value;
          option.textContent = config;
          if (i === -1) {
            option.text(config);
            option.attr('disabled', true);
            option.attr('selected', true);
            select.append(option);
            continue;
          }
          if (!object[i].isEnabled) option.attr('disabled', true);
          option.text(config);
          option.val(object[i].identifier);
          select.append(option);
        }
      },
      function (err) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error getting the options',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return [];
      },
    );
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
  document.head.append(style);

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
                              <th scope="col" hidden>Parent</th>	
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
    const button = $(this);
    const select = button.parent().find('select');
    const id = select.attr('id');
    const parentId = select.attr('parentId') || '';


    const properties = {
      envId: matchedEnvironment,
      infId: matchedInfrastructure,
      regionId: matchedRegion._id,
      parentId: parentId,
    };
    HelperService.postRequest(
      '/newConfig/getCustomConfigs/' + id + '/' + parentId,
      { ...properties },
      function (res) {
        const object = res.object;
        const tbody = $('#editModal tbody');
        tbody.html('');
        for (let i = 0; i < object.length; i++) {
          const element = object[i];
          if (
            element.envId === matchedEnvironment &&
            element.regionId === matchedRegion._id &&
            element.envId === matchedInfrastructure
          )
            continue;
          const tr = createRow(
            parentId,
            element.identifier,
            element.value,
            element.isEnabled,
          );
          tbody.append(tr);
        }
      },
      function (err) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error getting the options',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return [];
      },
    );
    const createRow = (
      parentId = false,
      id = Date.now(),
      name = '',
      isEnabled = false,
    ) => {
      let tr = $('<tr></tr>');
      const tdId = $('<td hidden></td>');
      const tdParent = $('<td hidden></td>');
      const tdOption = $('<td></td>');
      const tdEnabled = $('<td></td>');
      const tdActions = $('<td></td>');

      const checkbox = $('<input></input>');
      checkbox.attr('type', 'checkbox');
      checkbox.attr('id', id);
      checkbox.attr('value', id);
      if (isEnabled) checkbox.attr('checked', true);

      // const editButton = document.createElement('button');
      // editButton.attr('type', 'button');
      // editButton.attr('class', 'btn btn-primary');
      // editButton.attr('data-toggle', 'modal');
      // editButton.attr('data-target', '#editModal');
      // editButton.attr('data-id', object[i].identifier);
      // editButton.innerHTML = '<i class="fas fa-edit"></i>';

      const deleteButton = $('<button></button>');
      deleteButton.attr('type', 'button');
      deleteButton.attr('class', 'btn btn-danger');
      deleteButton.attr('data-id', id);
      deleteButton.html('<i class="fas fa-trash-alt"></i>');

      tdId.attr('hidden', true);
      tdId.text(id);
      tdParent.text(parentId);
      tdOption.text(name);
      tdEnabled.append(checkbox);
      // tdActions.append(editButton);
      tdActions.append(deleteButton);

      tr.append(tdId, tdParent, tdOption, tdEnabled, tdActions);

      return tr;
    };
    // Makes the name capable of editing
    $('#editModal tbody').on('click', 'td:nth-child(3)', function () {
      const td = $(this);
      const input = $('<input></input>');
      input.attr('type', 'text');
      input.attr('value', td.text());
      td.text('');
      td.append(input);
      input.focus();
    });

    // When clicking outside the input, it becomes a text again
    $('#editModal tbody').on('focusout', 'td:nth-child(3) input', function () {
      const input = $(this);
      const td = $(this).parent();
      td.text(input.val());
    });

    // When clicking the delete button, it deletes the row
    $('#editModal tbody').on('click', 'td:nth-child(5) button', function () {
      const tr = $(this).parent().parent();
      tr.remove();
    });
    $('#editModal').off('click', '#addOption');
    $('#editModal').on('click', '#addOption', (e) => {
      e.preventDefault();
      const tbody = $('#editModal tbody');
      const tr = createRow(parentId);
      tbody.append(tr);
    });

    $('#saveChanges').attr('value', this.value);
    $('#addOption').attr('parentId', parentId);
    $('#editModal').modal('show');
  });

  // Save Changes Event
  $('#saveChanges').on('click', function () {
    var data = [];
    // For every row in the table, it gets the values and creates a JSON
    $('#editModal tbody tr').each(function () {
      const id = $(this).find('td:nth-child(1)').text();
      const parentId = $(this).find('td:nth-child(2)').text();
      const value = $(this).find('td:nth-child(3)').text().trim();
      const enabled = $(this).find('td:nth-child(4) input').is(':checked');
      console.log(value == "");
      if (value == "") {
        Swal.fire({
          title: 'Error',
          text: 'Please fill the values correctly',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }

      const object = {
        identifier: id,
        value: value,
        isEnabled: enabled,
        envId: matchedEnvironment,
        infId: matchedInfrastructure,
        regionId: matchedRegion._id,
        parentId: parentId,
      };
      data.push(object);
    });
    $.ajax({
      url: '/newConfig/setCustomConfigs/' + this.value,
      type: 'PUT',
      data: { data: JSON.stringify(data), envId: matchedEnvironment, infId: matchedInfrastructure, regionId: matchedRegion._id },
      dataType: 'json',
      success: function (res) {
        Swal.fire({
          title: 'Success',
          text: 'The options has been updated',
          icon: 'success',
          confirmButtonText: 'Ok',
        });
        const data = res.object;
        const value = res.value;
        const select = $('select#' + value);

        select.html('');
        for (let i = -1; i < data.length; i++) {
          const option = $('<option></option>');
          const config = i === -1 ? DEFAULTMESSAGE : data[i].value;

          option.textContent = config;
          if (i === -1) {
            option.text(config);
            option.attr('disabled', true);
            option.attr('selected', true);
            select.append(option);
            continue;
          }
          if (!data[i].isEnabled) option.attr('disabled', true);
          option.text(config);
          option.val(data[i].identifier);
          select.append(option);
        }
        select.select2(SELECT2CONFIG);

        $('#editModal').modal('hide');
      },
      error: function (err) {
        Swal.fire({
          title: 'Error',
          text: 'There was an error updating the options',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  });
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

  const SELECT2CONFIG = {
    templateResult: templateResult,
    dropdownAutoWidth: true,
    closeOnSelect: false,
    placeholder: DEFAULTMESSAGE,
  };
}
