$(document).ready(function () {
  console.log("upload script is running");
  const messageView = $('#message-text');

  let csvFile;
  $('input[type=file]').on('change', prepareUpload);

  function prepareUpload(event) {
    csvFile = event.target.files[0];
    console.log(csvFile);
    messageView.text(`File selected: ${csvFile.name}`);
  }

  $('#upload-form').submit((event) => {
    event.preventDefault();
    $("#submit-button").hide();

    messageView.text("Processing your file, do hold on....");
    const formData = new FormData();
    formData.append('timetable_file', csvFile);

    $.ajax({
      type: 'post',
      url: '/upload',
      enctype: 'multipart/form-data',
      processData: false,
      cache: false,
      contentType: false,
      data: formData,
      success: (data) => {
        messageView.text('Zip file downloaded contains the invoices for all companies');
        const realoadButton = $("#reload-button");
        realoadButton.show();
        realoadButton.on('click', event1 => {
          event1.preventDefault();
          window.location = '/';
        });

        // The actual download
        const link = document.createElement('a');
        link.href = data.message;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (error) => {
        messageView.text(error.message);
      }
    });
  });

});
