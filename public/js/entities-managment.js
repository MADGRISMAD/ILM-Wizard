var entities = [];
let matchedEntity = null;

function fetchAndRenderEntities() {
  NewEntities.getEntitites().done(function (data) {
    var cardRow = document.querySelector('#card-container .row');

    // First, we'll clear the existing entities in the display:
    while (cardRow.firstChild) {
      cardRow.removeChild(cardRow.firstChild);
    }

    if (data.code == 'OK') {
      entities = data.object;

      if (entities.length === 0) {
        var jumbotronDiv = document.createElement('div');
        jumbotronDiv.className = 'jumbotron';
        jumbotronDiv.innerHTML = `
                  <h1 class="display-4">No entities available</h1>
                  <p class="lead">Please, add new entities to view them here.</p>
              `;

        cardRow.appendChild(jumbotronDiv);
      } else {
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i];
          var style = entity.isEnabled ? '' : 'filter: grayscale(100%);'; // If disabled, apply gray filter
          var disabledNote = entity.isEnabled
            ? ''
            : "<p class='text-center text-muted'>Disabled</p>";

          var cardDiv = document.createElement('div');
          cardDiv.className = 'col-2 mx-auto';
          cardDiv.innerHTML = `
                      <div id="card-${entity._id}" class="card" style="width: 100%;" onclick="test('${entity._id}')">
                          <img src="${entity.flag}" class="card-img-top img-fluid" style="${style}" alt="...">
                          <div class="card-body py-2">
                              <h3 class="card-title text-center mb-2" id="country${i}">${entity.companyName}</h3>
                              ${disabledNote}
                          </div>
                      </div>
                  `;

          cardRow.appendChild(cardDiv);
        }
      }
    } else {
      // Here you can handle the case where data.code is not "OK", for example, by showing an error message.
    }
  });
}

$(document).ready(function () {
  fetchAndRenderEntities();
});
// Add entity
$(document).ready(function () {
  // Add click event to the button
  $('#addEntity').click(function () {
    // Dynamically generate the input fields in the modal
    const currentTimestamp = new Date().getTime();
    const _idValue = (currentTimestamp + '').substr(1); // Convert the timestamp to string and extract the last 16 digits.
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Add New Entity</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="entityForm">
                <div class="form-group">
                    <label for="_id">Identifier:</label>
                    <input type="text" class="form-control" id="_idInput" value="${_idValue}" readonly>
                </div>
                <div class="form-group">
                    <label for="companyName">Company Name:</label>
                    <input type="text" class="form-control" id="companyNameInput" placeholder="Enter company name">
                </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <input type="text" class="form-control" id="descriptionInput" placeholder="Enter description">
                </div>
                <div class="form-group">
                    <label for="flag">Flag:</label>
                    <select class="form-control" id="flagInput">
                       <option value="assets/img/MEXICO.jpg">MX</option>
                        <option value="assets/img/Usa.jpg">USA</option>
                        <option value="assets/img/SantanderLogo.jfif">Santander</option>
                    </select>
                </div>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="isEnabledInput">
                    <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-outline-primary" id="saveEntity">Accept</button>
        </div>
    `;

    // Add the content to the modal
    $('#exampleModal .modal-content').html(modalContent);

    // Open the modal
    $('#exampleModal').modal('show');
    // Add event listener to _idInput
    // Add event listener to _idInput
    $('#_idInput').focus(function () {
      // Prevent the input from being focused
      $(this).blur();

      // Show a notification in English
      Swal.fire({
        icon: 'info',
        title: 'Information',
        text: 'The code is automatically generated and cannot be modified.',
      });
    });
  });

  // Add click event to the "Accept" button inside the modal
  $('#exampleModal').on('click', '#saveEntity', function () {
    const _id = $('#_idInput').val().trim();
    const companyName = $('#companyNameInput').val().trim();
    const description = $('#descriptionInput').val().trim();
    const flag = $('#flagInput').val();
    const isEnabled = $('#isEnabledInput').prop('checked');

    // Remove the error class previously added
    $(
      '#_idInput, #companyNameInput, #descriptionInput, #flagInput',
    ).removeClass('error-input');

    let allFieldsFilled = true;

    if (!_id) {
      $('#_idInput').addClass('error-input');
      allFieldsFilled = false;
    }
    if (!companyName) {
      $('#companyNameInput').addClass('error-input');
      allFieldsFilled = false;
    }
    if (!description) {
      $('#descriptionInput').addClass('error-input');
      allFieldsFilled = false;
    }
    if (!flag) {
      $('#flagInput').addClass('error-input');
      allFieldsFilled = false;
    }

    if (!allFieldsFilled) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Fields',
        text: 'Please, fill in all the fields.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'The new entity will be added with the provided data.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Create an entity object with the data
        const newEntity = {
          _id,
          companyName,
          description,
          isEnabled,
          flag,
        };

        // Send the data to the "controller" using an AJAX request
        $.ajax({
          url: '/newentities/saveEntities',
          type: 'POST',
          dataType: 'json',
          data: newEntity,
          success: function (response) {
            if (response.code === 'OK') {
              console.log('Data successfully sent to the controller', response);
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'The data has been saved successfully',
              });
              // Close the modal
              $('#exampleModal').modal('hide');
              fetchAndRenderEntities();
            } else {
              // Handle other response codes, if there are any in the future.
              console.log('Unexpected server response:', response);
            }
          },
          error: function (error) {
            // Here we handle the 409 response for the duplicated entity.
            if (error.status === 409) {
              Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'An entity with that _id already exists.',
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Error sending data to the controller.',
              });
            }
          },
        });
      }
    });
  });
});

function test(tagId) {
  // 1. Remove 'selected' class from all cards
  $('.card').removeClass('selected');

  // 2. Find entity object by tagId
  matchedEntity = entities.find((entity) => entity._id === tagId);

  // 3. Check if the entity was found
  if (matchedEntity) {
    // 4. Add 'selected' class to the card
    $(`#card-${tagId}`).addClass('selected');
    console.log('Entity found', matchedEntity);
  } else {
    console.log('Entity not found');
  }
}

//----confirm entity----------------
$(document).ready(function () {
  // ... (your existing code for card selection)

  // Add a click event to the confirm button
  $('#confirmSelection').click(function () {
    if (matchedEntity) {
      if (!matchedEntity.isEnabled) {
        // If matchedEntity has isEnabled set to false, show an error message and do not continue.
        Swal.fire({
          icon: 'error',
          title: 'Action Forbidden',
          text: 'The selected entity is disabled and cannot be confirmed.',
        });
        return; // This ends the function here and will not execute the following code.
      }

      // Ask if the user really wants to confirm the selection
      // Swal.fire({
      //   title: 'Are you sure?',
      //   text: `You are about to confirm the selection of ${matchedEntity.companyName}. Do you wish to continue?`,
      //   icon: 'warning',
      //   showCancelButton: true,
      //   confirmButtonText: 'Yes, confirm',
      //   cancelButtonText: 'Cancel',
      // }).then((result) => {
      //   
      // });
      $('#company-tab').tab('show');
      // Other actions you might want to perform after confirming the selection
    } else {
      // Show a message if no card is selected
      Swal.fire({
        icon: 'warning',
        title: 'No Selection',
        text: 'Please select a card before confirming.',
      });
    }
  });
});

//----edit entity----------------
$(document).ready(function () {
  function showModalContent(editEntity) {
    const isEditing = editEntity !== undefined;
    const modalContent = `
        <div class="modal-header">
            <h5 class="modal-title" id="entityModalLabel">${
              isEditing ? 'Edit Entity ' + matchedEntity._id : 'Add New Entity'
            }</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="modal-body">
            <form id="entityForm">
            <div class="form-group">
            <label for="_id">Identifier:</label>
            <input type="text" class="form-control" id="_idInput" placeholder="Enter _id" value="${
              isEditing ? editEntity._id : ''
            }" ${isEditing ? 'disabled' : ''}>
        </div>
        <div class="form-group">
            <label for="companyName">Company Name:</label>
            <input type="text" class="form-control" id="companyNameInput" placeholder="Enter company name" value="${
              isEditing ? editEntity.companyName : ''
            }" ${isEditing ? 'disabled' : ''}>
        </div>
                <div class="form-group">
                    <label for="description">Description:</label>
                    <input type="text" class="form-control" id="descriptionInput" placeholder="Enter description" value="${
                      isEditing ? editEntity.description : ''
                    }">
                </div>
                <div class="form-group">
                    <label for="flag">Flag:</label>
                    <select class="form-control" id="flagInput">
          <option value="assets/img/MEXICO.jpg" ${
            isEditing && editEntity.flag === 'assets/img/MEXICO.jpg'
              ? 'selected'
              : ''
          }>MX</option>
          <option value="assets/img/Usa.jpg" ${
            isEditing && editEntity.flag === 'assets/img/Usa.jpg'
              ? 'selected'
              : ''
          }>USA</option>
          <option value="assets/img/SantanderLogo.jfif" ${
            isEditing && editEntity.flag === 'assets/img/SantanderLogo.jfif'
              ? 'selected'
              : ''
          }>Santander Logo</option>
      </select>
                </div>
                <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="isEnabledInput" ${
                      isEditing && editEntity.isEnabled ? 'checked' : ''
                    }>
                    <label class="custom-control-label" for="isEnabledInput">Enabled</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-outline-primary" id="saveEntity">${
              isEditing ? 'Update' : 'Accept'
            }</button>
        </div>
    `;

    $('#entityModal .modal-content').html(modalContent);
    $('#entityModal').modal('show');
  }

  $('#editEntity').click(function () {
    if (!matchedEntity) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before continuing.',
      });
      return;
    }
    showModalContent(matchedEntity); // Show modal to edit
  });

  function hasChanges(editedEntity, originalEntity) {
    return (
      editedEntity.description !== originalEntity.description ||
      editedEntity.flag !== originalEntity.flag ||
      editedEntity.isEnabled !== originalEntity.isEnabled
    );
  }

  $('#entityModal').on('click', '#saveEntity', function () {
    const _id = $('#_idInput').val().trim();
    const companyName = $('#companyNameInput').val().trim();
    const description = $('#descriptionInput').val().trim();
    const flag = $('#flagInput').val();
    const isEnabled = $('#isEnabledInput').prop('checked');

    if (!matchedEntity) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before continuing.',
      });
      return;
    }

    const updatedEntity = {
      _id,
      companyName,
      description,
      isEnabled,
      flag,
    };
    if (hasChanges(updatedEntity, matchedEntity)) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'The entity will be updated with the provided data.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, update',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateEntity(updatedEntity);
        }
      });
    } else {
      updateEntity(updatedEntity);
    }
  });

  function updateEntity(updatedEntity) {
    $.ajax({
      url: `/newentities/editEntities`,
      type: 'PUT',
      dataType: 'json',
      data: updatedEntity,
      success: function (response) {
        if (response && response.code === 'OK') {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'The entity has been successfully updated',
          });

          // Close the modal
          $('#entityModal').modal('hide');
          fetchAndRenderEntities();
        } else {
          // Handle error based on server response
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response.message || 'There was an error updating the entity.',
          });
        }
      },
      error: function (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error sending data to the controller.',
        });
      },
    });
  }
});

//----delete entity----------------
$(document).ready(function () {
  $('#deleteEntity').click(function () {
    if (!matchedEntity) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please, select a card before continuing.',
      });
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this entity?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        removeEntity(matchedEntity);
      }
    });
  });

  function removeEntity(entity) {
    // Find the index of the entity in the entities array
    const index = entities.findIndex((e) => e._id === entity._id);

    // If found, remove from the array
    if (index !== -1) {
      entities.splice(index, 1);

      $.ajax({
        url: `/newentities/deleteEntity`,
        type: 'DELETE',
        dataType: 'json',
        data: entity,
        success: function (response) {
          if (response && response.code === 'OK') {
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'The entity has been successfully deleted',
            });

            // Optional: update the UI to reflect the deletion
            fetchAndRenderEntities();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'Error deleting the entity.',
            });
          }
        },
        error: function () {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'There was an error deleting the entity.',
          });
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Entity not found.',
      });
    }
  }
});
