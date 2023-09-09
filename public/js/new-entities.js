// $(document).ready (function () {
//   $.get('http://localhost:3000/newentities/obtenerEntidades', function (data, status) {
//     console.log(data);
//     console.log(status);
//   }
//   );
// });

const NewEntities = {

  getEntitites: function () {
    //  return $.get('http://localhost:3000/newentities/obtenerEntidades', function (data, status) { });

     return $.ajax({url: "http://localhost:3000/newentities/obtenerEntidades"}).done(function(data, status) {});
  }
}









