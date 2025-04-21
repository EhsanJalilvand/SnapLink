/**
 * Set the link ID in the hidden input field for the datePicker modal.
 * @param {string} linkId - The ID of the link to edit.
 */
function setLinkIdForDatePickerModal(linkId) {
    document.getElementById('linkId').value = linkId;
}

$(function () {
    // Determine if the current language is Persian
    const isPersian = (window.APP_CONFIG.lang || 'en') === 'fa';
    const dateFormat = isPersian ? "YYYY/MM/DD" : "YYYY-MM-DD";

    /**
     * Initialize the date picker widget based on the selected language
     */
    const initDatePicker = () => {
        $("#datepickerWidget").persianDatepicker({
            format: dateFormat,
            initialValue: false,
            autoClose: true,
            calendarType: isPersian ? "persian" : "gregorian",
            toolbox: {
                calendarSwitch: { enabled: false } // Prevent switching calendars
            },
            onSelect: function (unix) {
                if (!$("#disableDateSwitch").prop('checked')) {
                    const dateText = new persianDate(unix).format(dateFormat);
                    $("#dateDisplayText").text(dateText);
                    $("#finalDateValue").val(dateText);
                }
            }
        });

        // Open the date picker when the visible element is clicked
        $("#dateInputTrigger").click(function () {
            if (!$("#disableDateSwitch").prop('checked')) {
                $("#datepickerWidget").focus();
            }
        });
    };

    /**
     * Handle enabling/disabling of the expiration date input
     */
    $("#disableDateSwitch").change(function () {
        const isDisabled = $(this).prop('checked');

        if (isDisabled) {
            $("#dateDisplayText").text('Date Disabled');
            $("#finalDateValue").val('');
            $("#datepickerWidget").val('');
            $("#dateInputTrigger").css({
                'background-color': '#f8f9fa',
                'cursor': 'not-allowed'
            });
        } else {
            $("#dateDisplayText").text('Select Date');
            $("#dateInputTrigger").css({
                'background-color': '#fff',
                'cursor': 'pointer'
            });
        }
    });

    /**
     * Submit the selected expiration date to the server
     */
    $("#confirmDateBtn").click(function () {
        const selectedDate = $("#finalDateValue").val();
        const isDisabled = $("#disableDateSwitch").prop('checked');
        const linkId = document.getElementById('linkId').value;

        $.ajax({
            url: `/s/expireDate`,
            method: 'PUT',
            data: {
                id: linkId,
                expireDate: (isDisabled || selectedDate === '') ? null : selectedDate
            },
            success: () => {
                $('#datePickerModal').modal('hide');

                // Refresh the links table if function exists
                if (typeof window.loadLinksTable === 'function') {
                    window.loadLinksTable(1);
                }

                // Blur any active elements and remove leftover modals
                document.activeElement.blur();
                setTimeout(() => {
                    $('.modal-backdrop').remove();
                }, 300);
            },
            error: (xhr) => {
                if (xhr && xhr.status === 401) {
                    window.location.href = xhr.responseJSON.redirect;
                    return;
                }

                const errors = xhr.responseJSON;
                if (errors && Array.isArray(errors)) {
                    showAlert(errors.join('\n'), 'danger');
                } else {
                    showAlert('An error occurred while generating the link', 'danger');
                }
            }
        });
    });

    // Start the date picker when the page is ready
    initDatePicker();
});
