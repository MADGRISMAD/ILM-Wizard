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
  const titles = [
    'Config 1', 'Config 2', 'Config 3', 'Config 4', 'Config 5',
    'Config 6', 'Config 7', 'Config 8', 'Config 9', 'Config 10'
  ];

  for (let i = 0; i < titles.length; i += 3) {
    const row = document.createElement('div');
    row.classList.add('form-row', 'mb-4');

    // Create 3 columns (if available) for this row
    for (let j = 0; j < 3 && (i + j) < titles.length; j++) {
      const col = document.createElement('div');
      col.classList.add('col-4', 'd-flex', 'flex-column', 'pr-3', 'pl-3');

      const label = document.createElement('label');
      label.textContent = titles[i + j];
      col.appendChild(label);

      const dropdownDiv = document.createElement('div');
      dropdownDiv.classList.add('d-flex', 'align-items-center', 'dropdown-container');

      const select = document.createElement('select');
      select.classList.add('form-control', 'with-button');
      const option1 = document.createElement('option');
      option1.textContent = 'Option 1';
      const option2 = document.createElement('option');
      option2.textContent = 'Option 2';
      select.append(option1, option2);
      dropdownDiv.appendChild(select);

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
