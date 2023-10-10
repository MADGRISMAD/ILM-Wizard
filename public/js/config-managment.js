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
  // Uses title and configuration name in JSON
  const configs = [
    ["Server Name"], ["Other Software", "otherSoftwareProducts"], ["HA", "haList"], ["NAS", "nasList"], ["Active Directories", "activeDirectories"], ["Disabled Products", "disabledProducts"],  
    ["Cluster Class", "clusterClasses"], ["Business Type", "businessTypes"], ["Metal", "metalByTenantList"], ["Availability Zone", "availabilityZones"], ["Network", "networkRegions"], 
    ["Cluster Type", "clusterTypes"]
  ];


  $.ajax({
    url: "/newConfig/getConfigs",
    type: "GET",
    success: function(resp){
      for (let i = 0; i < configs.length; i += 3) {
        const row = document.createElement('div');
        row.classList.add('form-row', 'mb-4');
        
        

        // Create 3 columns (if available) for this row
        for (let j = 0; j < 3 && (i + j) < configs.length; j++) {
          
          const col = document.createElement('div');
          col.classList.add('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');
          // Gets the title from the configs array
          const title = configs[i+j][0];
          // Creates the label
          const label = document.createElement('label');
          label.textContent = title;
          col.appendChild(label);
    
          // Creates the container
          const dropdownDiv = document.createElement('div');
          dropdownDiv.classList.add('d-flex', 'align-items-center', 'dropdown-container');
          
          // When is the first input, it is a text input, otherwise it is a select
          if(i != 0 || j != 0){
                      const select = document.createElement('select');
          select.classList.add('form-control', 'with-button');
          for(let k = 0; k < resp.object[configs[i + j][1]].length; k++){
            if(k == 0){
              const option = document.createElement('option');
              option.textContent = title;
              option.setAttribute('disabled', true);
              option.setAttribute('selected', true);
              select.append(option);
            }

            const option = document.createElement('option');
            const config = resp.object[configs[i + j][1]][k]
            if(typeof config == "object")
              option.textContent = config.name ? config.name : config.companlyAlias;
            else
              option.textContent = config;
            select.append(option);
          }
          dropdownDiv.appendChild(select);
          }
          else{
            const first = document.createElement('input');
            first.classList.add('form-control', 'with-button');
            dropdownDiv.appendChild(first);
          }

          // Adds the button
          const button = document.createElement('button');
          button.classList.add('btn', 'btn-secondary', 'config-button');
          button.innerHTML = '<i class="fas fa-cog"></i>';
          dropdownDiv.appendChild(button);
    
          col.appendChild(dropdownDiv);
          row.appendChild(col);
        }
    
        container.appendChild(row);
        // Add a divider after the first row
        if (i === 0) {
          const divider = document.createElement('hr');
          container.appendChild(divider);
        }
      }
    }
  });
    // Styles to adjust the select dropdown and place the button next to the select arrow
    const style = document.createElement('style');
    style.innerHTML = `
          .dropdown-container .form-control.with-button {
              padding-right: 2.5rem;  /* Adjust padding to make space for the button */
          }
          .config-button {
              position: absolute;
              right: 0.5rem;  /* Position of the button */
              z-index: 2;
              border-left: 1px solid #ccc;  /* Vertical divider */
              background-color: white;
              color: #333;  /* Color for the cog icon */
              border-color: #ccc;  /* Border color to match the rest of the select */
          }
      `;
    document.head.appendChild(style);




});
