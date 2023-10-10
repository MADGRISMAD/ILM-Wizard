$(document).ready(function() {
  const summaryContainer = $('#summary .container');

  // Título Resumen de configuración y enlace a Home
  summaryContainer.append($('<h2>').addClass('mb-4').text('Resumen de configuración'));
  summaryContainer.append($('<a>').attr('href', '#').text('Home >'));

  // Contenedor para las dos columnas
  const twoColRow = $('<div>').addClass('row mt-4');
  const colLeft = $('<div>').addClass('col-md-6');
  const colRight = $('<div>').addClass('col-md-6');
  twoColRow.append(colLeft, colRight);
  summaryContainer.append(twoColRow);

  // Secciones para la columna izquierda
  colLeft.append(createSection('Location', [
      { label: 'ENTITY', id: 'location-entity' },
      { label: 'REGION', id: 'location-region' },
      { label: 'COMPANY', id: 'location-company' }
  ]));
  colLeft.append(createSection('Enviroments & Infra', [
      { label: 'DEV', value1: 'OHE', value2: 'VMWare' },
      { label: 'QA', value1: 'OHE', value2: 'VMWare' }
  ]));
  colLeft.append(createSection('Settings', [
      { label: 'Ha List', value1: 'OHE' }
  ]));

  // Secciones para la columna derecha
  colRight.append(createSection('Metal By Tenant List', [
      { label: 'BRONZE', value1: 'GOLD' }
  ]));
  colRight.append(createSection('Disable Products', [
      { label: 'product1', value1: 'product2' }
  ]));

  // Botones al final
  const btnRow = $('<div>').addClass('row mt-4');
  btnRow.append(
      $('<div>').addClass('col-md-6 text-left').append($('<button>').addClass('btn btn-primary').text('GO BACK')),
      $('<div>').addClass('col-md-6 text-right').append($('<button>').addClass('btn btn-danger').text('Confirmar'))
  );
  summaryContainer.append(btnRow);

  function createSection(title, rows) {
      const section = $('<div>').addClass('mt-4');
      section.append($('<h4>').text(title).append($('<a>').attr('href', '#').text('(edit)')));
      const table = $('<table>').addClass('table');
      const tbody = $('<tbody>');
      rows.forEach(row => {
          const tr = $('<tr>');
          tr.append($('<td>').text(row.label));
          tr.append(row.id ? $('<td>').attr('id', row.id) : $('<td>').text(row.value1 || ''));
          if (row.value2) {
              tr.append($('<td>').text(row.value2));
          }
          tbody.append(tr);
      });
      table.append(tbody);
      section.append(table);
      return section;
  }
});
