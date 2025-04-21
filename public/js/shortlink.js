let linkId = '';



document.addEventListener("DOMContentLoaded", function () {
    const generateBtn = document.getElementById("generateBtn");
    const newBtn = document.getElementById("newBtn");
    const linkInput = document.getElementById("linkInput");
    const resultContainer = document.getElementById("resultContainer");
    const shortLinkText = document.getElementById("shortLinkText");
    const copyBtn = document.getElementById("copyBtn");
    const visitBtn = document.getElementById("visitBtn");
    const setPasswordBtn = document.getElementById("setPasswordBtn");
    const setDescriptionBtn = document.getElementById("setDescriptionBtn");
    const setExpireDateBtn = document.getElementById("setExpireDateBtn");

    // Generate short link
    generateBtn.addEventListener("click", function () {
        const originalLink = linkInput.value.trim();


        generateBtn.disabled = true;
        generateBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${generateBtn.dataset.generating}
    `;

        $.ajax({
            url: '/generatelink',
            method: 'POST',
            data: {
                originalLink: originalLink
            },
            success: (res) => {
                showLink(res.id, originalLink, res.shortLink, res.isEnable, false);
                if (typeof window.loadLinksTable === 'function')
                    window.loadLinksTable(1);
            },
            error: (xhr, status, error) => {
                generateBtn.disabled = false;
                generateBtn.innerHTML = `
                <i class="fas fa-bolt me-2"></i>
                ${generateBtn.dataset.generateBtn}
            `;

                if (xhr && xhr.status === 401) {
                    window.location.href = xhr.responseJSON.redirect;
                    return;
                }

                const errors = xhr.responseJSON;
                if (errors) {
                    const errorMessage = errors.join('\n');
                    showAlert(errorMessage, 'danger');
                } else {
                    showAlert('An error occurred while generating the link', 'danger');
                }
            }
        });
    });
    newBtn.addEventListener('click', function () {
        linkInput.disabled = false;
        linkInput.value = '';
        generateBtn.style.display = "inline-block";
        newBtn.style.display = "none";
        resultContainer.style.display = "none";
        linkInput.style.backgroundColor = "";
    });
    setDescriptionBtn.addEventListener('click', () => {
        setLinkIdForDescriptionModal(linkId);

    });
    setPasswordBtn.addEventListener('click', () => {
        setLinkIdForPasswordModal(linkId);

    });
    setExpireDateBtn.addEventListener('click', () => {
        setLinkIdForDatePickerModal(linkId);

    });

    // Copy short link
    copyBtn.addEventListener("click", function () {
        navigator.clipboard.writeText(shortLinkText.textContent)
            .then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check me-2"></i>Copied';
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                }, 2000);
            })
            .catch(() => {
                showAlert('Failed to copy link. Please try again.', 'danger');
            });
    });

    // Share buttons
    document.querySelectorAll('.social-share a').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (!shortLinkText.textContent) {
                showAlert('Please generate a link first', 'warning');
                return;
            }

            const network = this.getAttribute('data-network');
            const url = encodeURIComponent(shortLinkText.textContent);
            const text = encodeURIComponent('Check out this short link: ');

            let shareUrl = '';
            switch (network) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${text}%20${url}`;
                    break;
            }

            window.open(shareUrl, '_blank', 'width=600,height=400');
        });
    });


});
const showLink = (_linkId, _originalLink, _shortLink, _isEnable, _canAddNewLink) => {
    linkId = _linkId;
    linkInput.value = _originalLink;
    shortLinkText.textContent = _shortLink;
    linkId = _linkId;
    visitBtn.href = _shortLink;
    resultContainer.style.display = "block";
    if (_canAddNewLink) {
        linkInput.disabled = false;
        generateBtn.style.display = "inline-block";
        newBtn.style.display = "none";
        linkInput.style.backgroundColor = "";
    }
    else {
        linkInput.disabled = true;
        generateBtn.style.display = "none";
        newBtn.style.display = "inline-block";
        linkInput.style.backgroundColor = "#f0f0f0";
    }
    generateBtn.disabled = false;
    generateBtn.innerHTML = `
            <i class="fas fa-bolt me-2"></i>
            ${generateBtn.dataset.generateBtn}
        `;
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const shortLinkDiv = document.getElementById("shortLink");
    shortLinkDiv.classList.remove("alert-success", "alert-danger");
    if (_isEnable) {
        shortLinkDiv.classList.add("alert-success");
    } else {
        shortLinkDiv.classList.add("alert-danger");
    }
}
// Helper function to show alerts
const showAlert = (message, type) => {
    // Remove any existing alerts first
    document.querySelectorAll('.alert-dismissible').forEach(alert => {
        alert.remove();
    });

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
    alertDiv.innerHTML = `
${message}
<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
`;

    const container = document.querySelector('.card-body');
    container.insertBefore(alertDiv, container.children[2]);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

