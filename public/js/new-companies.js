const NewCompanies= {

  getEntitites: function () {
     return $.ajax({url: "http://localhost:3000/newentities/obtenerCompanies"}).done(function(data, status) {});
  }
}


