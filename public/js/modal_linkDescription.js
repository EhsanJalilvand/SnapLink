/**
 * Set the link ID in the hidden input field for the description modal.
 * @param {string} linkId - The ID of the link to edit.
 */
function setLinkIdForDescriptionModal(linkId) {
    document.getElementById('linkId').value = linkId;
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const saveDescriptionBtn = document.getElementById('saveDescriptionBtn');
    const linkTitleInput = document.getElementById('linkTitle');
    const linkDescriptionInput = document.getElementById('linkDescription');
    const descriptionForm = document.getElementById('descriptionForm');

    // Exit if any required elements are missing
    if (!saveDescriptionBtn || !linkTitleInput || !linkDescriptionInput || !descriptionForm) return;

    // Handle click event on the Save button
    saveDescriptionBtn.addEventListener('click', () => {
        // Get values from form inputs
        const linkId = document.getElementById('linkId').value;
        const title = linkTitleInput.value.trim();
        const description = linkDescriptionInput.value.trim();

        // Send AJAX request to update title and description
        $.ajax({
            url: `/s/description`,
            method: 'PUT',
            data: {
                id: linkId,
                title,
                description
            },
            success: () => {
                // On success: reset the form, hide modal, refresh table
                descriptionForm.reset();
                $('#descriptionModal').modal('hide');

                if (typeof window.loadLinksTable === 'function') {
                    window.loadLinksTable(1);
                }

                // Remove focus from active element and clean up modal backdrop
                document.activeElement.blur();
                setTimeout(() => {
                    $('.modal-backdrop').remove();
                }, 300);
            },
            error: (xhr) => {
                // If unauthorized, redirect to login or provided path
                if (xhr?.status === 401) {
                    window.location.href = xhr.responseJSON.redirect;
                    return;
                }

                // Show error messages if present, otherwise show default error
                const errors = xhr.responseJSON;
                if (errors && Array.isArray(errors)) {
                    const errorMessage = errors.join('\n');
                    showAlert(errorMessage, 'danger');
                } else {
                    showAlert('An error occurred while updating the description', 'danger');
                }
            }
        });
    });
});