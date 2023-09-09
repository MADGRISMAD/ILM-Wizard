$(document).ready(function () {
  NewCompanies.getEntitites().done(function (data) {
    if (data.code == "OK") {
      var companias = data.object;
      var companyList = document.getElementById("company-list");

      for (var i = 0; i < companias.length; i++) {
        var company= companias[i];

        // Crear un nuevo elemento de lista
        var listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.id = "company" + (i + 1);
        listItem.textContent = company.identifier;

        // Agregar el elemento de lista a la lista
        companyList.appendChild(listItem);
      }
    }
  });
});
