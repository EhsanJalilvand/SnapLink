/**
 * Sets the link ID for the password modal.
 * This ID is used to identify which link's password is being updated.
 * @param {string} linkId - The unique identifier of the link.
 */
function setLinkIdForPasswordModal(linkId) {
    document.getElementById('linkId').value = linkId;
}

document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const passwordInput = document.getElementById('linkPassword');
    const confirmPasswordInput = document.getElementById('confirmLinkPassword');
    const passwordForm = document.getElementById('passwordForm');

    // Exit if essential elements are not found
    if (!savePasswordBtn || !passwordInput || !confirmPasswordInput || !passwordForm) return;

    // Handle Save button click event
    savePasswordBtn.addEventListener('click', () => {
        // Get form values
        const linkId = document.getElementById('linkId').value;
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
if(password!=confirmPassword)
    showAlert('Password Is Not Match', 'danger');
        // Send AJAX request to update the password
        $.ajax({
            url: `/s/password`,
            method: 'PUT',
            data: {
                id: linkId,
                password,
                confirmPassword
            },
            success: () => {
                // On success: reset the form, close modal, clean backdrop
                passwordForm.reset();
                $('#passwordModal').modal('hide');
                document.activeElement.blur();

                setTimeout(() => {
                    $('.modal-backdrop').remove();
                }, 300);
                showAlert(`New Password Added`, 'success');
            },
            error: (xhr) => {
                // If user is unauthorized, redirect to login page
                if (xhr?.status === 401) {
                    window.location.href = xhr.responseJSON.redirect;
                    return;
                }

                // Display error messages if available
                const errors = xhr.responseJSON;
                if (errors && Array.isArray(errors)) {
                    const errorMessage = errors.join('\n');
                    showAlert(errorMessage, 'danger');
                } else {
                    showAlert('An error occurred while updating the password', 'danger');
                }
            }
        });
    });
});
