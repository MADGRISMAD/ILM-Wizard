// $(document).ready(function () {
//   // do the ajax request to get the catalogs
//   $.ajax({
//     url: '/newconfig/fetch-catalogs',
//     method: 'GET',
//     dataType: 'json',
//     success: function (data) {
//       console.log(data);
//       // funtion to generate the combo selector
//       function generateComboSelector(containerId, items, title) {
//         console.log("generating selector for:", title);
//         var section = $('<div></div>');
//         var h4 = $('<h4></h4>').text(title);
//         var select = $('<select></select>').addClass('form-select').attr('aria-label', title + ' selection');

//         items.forEach(function (item) {
//           if (item.isenabled) {
//             var option = $('<option></option>').val(item.id_Env).text(item.id_Env);
//             select.append(option);
//           }
//         });

//         section.append(h4, select);
//         $(containerId).append(section);
//       }

//       generateComboSelector('#qtrContent', data.qtr, 'QTR');
//       generateComboSelector('#otherSoftwareContent', data.otherSoftware, 'Other Software');
//       generateComboSelector('#HAContent', data.HA, 'HA');
//     },
//     error: function () {
//       console.error("Error al obtener los datos.");
//     }
//   });
// });

$(document).ready(function () {
});
