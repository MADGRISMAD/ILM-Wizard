// $(document).ready (function () {
//   $.get('http://localhost:3000/newentities/obtenerEntidades', function (data, status) {
//     console.log(data);
//     console.log(status);
//   }
//   );
// });

const NewEntities = {

  getEntitites: function () {
     return $.get('http://localhost:3000/newentities/obtenerEntidades', function (data, status) { });
  }
}


  // $(document).ready(function(){

  //   $("#country1").append(entidades[0].identifier);
  //   $("#country2").append(entidades[1].identifier);

  //   $("#region1").append(companies[0].Company);
  //   $("#region2").append(companies[1].Company);


  // });
