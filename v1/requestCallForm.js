jQuery(function ($) {
  // Request Call Component
  // Parse the URL to extract userId, resourceID, and contactId
  const parsedUrl = new URL(window.location.href);
  const userId = parsedUrl.searchParams.get('userId');
  const resourceId = parsedUrl.searchParams.get('resourceId');
  const contactId = parsedUrl.searchParams.get('contactId');

  if(contactId) {
    $('#requestCallForm').hide();
  } else {
    $('#requestCallBtn').hide();
  }

  function requestCallButtonSubmit() {
    if(contactId) {
      $.get(
      'https://apiv2.rapidfunnel.com/v2/contact-details/' + contactId,
      function (response) {
        const contactData = response.data;
        // Make a POST request with contactData to send request call email to user
        $.ajax({
          url: 'https://app.rapidfunnel.com/api/mail/send-request-call-email',
          type: 'POST',
          contentType: 'application/json',
          dataType: "json",
          data: {
            legacyUserId: userId,
            contactFirstName: contactData.firstName,
            contactLastName: contactData.lastName,
            contactPhoneNumber: contactData.phone,
            requestCallSourcePage: resourceDescriptionForRequestCall
          },
          success: function (response) {
            console.log('Request Call email sent successfully', response);
          },
          error: function (xhr, status, error) {
            console.error('Request Call email failed', error);
          }
        });
      }
      ).fail(function () {
        console.error('Failed to fetch contact details.');
      });
    }
  }

  function requestCallFormSubmit() {
    if(contactId) {
        const contactFirstName = $('#contactFirstNameRequestForm').val();
        const contactLastName = $('#contactLastNameRequestForm').val();
        const contactPhoneNumber = $('#contactPhoneRequestForm').val();
      
        $.ajax({
        url: 'https://app.rapidfunnel.com/api/mail/send-request-call-email',
        type: 'POST',
        contentType: 'application/json',
        dataType: "json",
        data: {
          legacyUserId: userId,
          contactFirstName: contactFirstName,
          contactLastName: contactLastName,
          contactPhoneNumber: contactPhoneNumber,
          requestCallSourcePage: resourceDescriptionForRequestCall
        },
        success: function (response) {
          console.log('Request Call email sent successfully', response);
        },
        error: function (xhr, status, error) {
          console.error('Request Call email failed', error);
        }
      });
    }
  }

  $('#requestCallBtn').on('click', requestCallButtonSubmit);
  $('#requestForm').on('submit', function (event) {
    requestCallFormSubmit();
  });
});
