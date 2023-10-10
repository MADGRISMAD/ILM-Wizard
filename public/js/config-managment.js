document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('configDropdownContainer');

    // Adding title and subtitle
    const title = document.createElement('h2');
    title.textContent = 'Derived Configurations';
    container.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.textContent = 'Choose the appropriate option';
    container.appendChild(subtitle);

    // List of configuration titles
    const configs = [
        ["Server Name"], ["Other Software", "otherSoftwareProducts"], ["HA", "haList"], ["NAS", "nasList"], ["Active Directories", "activeDirectories"], ["Disabled Products", "disabledProducts"],
        ["Cluster Class", "clusterClasses"], ["Business Type", "businessTypes"], ["Metal", "metalByTenantList"], ["Availability Zone", "availabilityZones"], ["Network", "networkRegions"],
        ["Cluster Type", "clusterTypes"]
    ];

    $.ajax({
        url: "/newConfig/getConfigs",
        type: "GET",
        success: function(resp) {
            for (let i = 0; i < configs.length; i += 3) {
                const row = document.createElement('div');
                row.classList.add('form-row', 'mb-4');

                for (let j = 0; j < 3 && (i + j) < configs.length; j++) {
                    const col = document.createElement('div');
                    col.classList.add('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');

                    const title = configs[i+j][0];
                    const label = document.createElement('label');
                    label.textContent = title;
                    col.appendChild(label);

                    const dropdownDiv = document.createElement('div');
                    dropdownDiv.classList.add('d-flex', 'align-items-center', 'dropdown-container');

                    if (i !== 0 || j !== 0) {
                        const select = document.createElement('select');
                        select.classList.add('form-control', 'with-button');

                        for (let k = 0; k < resp.object[configs[i + j][1]].length; k++) {
                            const option = document.createElement('option');
                            const config = resp.object[configs[i + j][1]][k];

                            if (k === 0) {
                                option.textContent = title;
                                option.setAttribute('disabled', true);
                                option.setAttribute('selected', true);
                            } else if (typeof config === "object") {
                                option.textContent = config.name ? config.name : config.companlyAlias;
                            } else {
                                option.textContent = config;
                            }

                            select.append(option);
                        }
                        dropdownDiv.appendChild(select);
                    } else {
                        const first = document.createElement('input');
                        first.classList.add('form-control', 'with-button');
                        dropdownDiv.appendChild(first);
                    }

                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-secondary', 'config-button');
                    button.innerHTML = '<i class="fas fa-cog"></i>';
                    dropdownDiv.appendChild(button);

                    col.appendChild(dropdownDiv);
                    row.appendChild(col);
                }

                container.appendChild(row);

                if (i === 0) {
                    const divider = document.createElement('hr');
                    container.appendChild(divider);
                }
            }
        }
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
    document.addEventListener('click', function(event) {
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
    document.getElementById('saveChanges').addEventListener('click', function() {
        const newValue = document.getElementById('editInput').value;
        const activeConfigButton = document.querySelector('.config-button:focus');

        if (activeConfigButton) {
            const parentDiv = activeConfigButton.parentNode;
            const selectElement = parentDiv.querySelector('select');
            const inputElement = parentDiv.querySelector('input');

            if (selectElement) {
                const selectedOption = selectElement.options[selectElement.selectedIndex];
                selectedOption.textContent = newValue;
                selectedOption.value = newValue.toLowerCase().replace(/ /g, '_');
            } else if (inputElement) {
                inputElement.value = newValue;
            }
        }

        $('#editModal').modal('hide');
    });
});
