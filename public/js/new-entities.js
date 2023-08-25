


$(document).ready (function () {
  $.get('http://localhost:3000/newentities/obtenerEntidades', function (data, status) {
    console.log(data);
    console.log(status);
  }
  );
});

