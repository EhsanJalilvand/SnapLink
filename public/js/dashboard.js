/**
 * Toggles the visibility of the mobile sidebar.
 */
function toggleMobileSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    sidebar.classList.toggle('d-none');
}

// Determine if the current language is Persian (Farsi)
const isPersian = (window.APP_CONFIG.lang || 'en') === 'fa';

/**
 * Formats a given date string based on the selected language.
 * Uses the Jalali calendar for Persian, Gregorian otherwise.
 * @param {string} dateStr - The input date string.
 * @returns {string} - Formatted date string.
 */
const formatDate = (dateStr) => {
    return isPersian 
        ? moment(dateStr).format('jYYYY-jMM-jDD HH:mm') 
        : moment(dateStr).format('YYYY-MM-DD HH:mm');
};

/**
 * Handles and displays error messages from XHR responses.
 * Also resets the "generate" button to its initial state.
 * @param {object} xhr - The XMLHttpRequest object containing error info.
 */
const handleError = (xhr) => {
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
    if (errors && Array.isArray(errors)) {
        showAlert(errors.join('\n'), 'danger');
    } else {
        showAlert('An error occurred while generating the link', 'danger');
    }
};

/**
 * Renders table rows inside the links table using given link data.
 * @param {Array} items - Array of link objects to render.
 */
const renderLinkRows = (items) => {
    const $tbody = $('#links-table tbody');
    $tbody.empty();

    items.forEach(link => {
        const createdAt = formatDate(link.createdAt);
        const expireAt = link.expireAt ? formatDate(link.expireAt) : '-';

        $tbody.append(`
            <tr class="link-row"
                data-id="${link._id}" 
                data-title="${link.title}" 
                data-original="${link.originalLink}" 
                data-short="${link.shortLink}"
                data-isenable="${link.isEnable}">
                <td>${link.title}</td>
                <td class="text-truncate" style="max-width: 150px;">${link.originalLink}</td>
                <td>${createdAt}</td>
                <td>${expireAt}</td>
                <td>
                    <span class="badge status-toggle ${link.isEnable ? 'bg-success' : 'bg-danger'}"
                        data-id="${link._id}" style="cursor: pointer;">
                        ${link.isEnable ? 'Enable' : 'Disable'}
                    </span>
                </td>
            </tr>
        `);
    });
};

/**
 * Renders pagination buttons based on total pages and the current page.
 * @param {number} pageCount - Total number of pages.
 * @param {number} currentPage - Currently active page.
 */
const renderPagination = (pageCount, currentPage) => {
    const $pagination = $('#pagination');
    $pagination.empty();

    for (let i = 1; i <= pageCount; i++) {
        $pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `);
    }
};

/**
 * Fetches and loads the links table from the server.
 * @param {number} page - Page number to load.
 */
window.loadLinksTable = (page = 1) => {
    $.ajax({
        url: '/links',
        method: 'GET',
        data: { page, pageSize: 10 },
        success: (res) => {
            renderLinkRows(res.items);
            renderPagination(res.pageCount, page);
        },
        error: handleError
    });
};

/**
 * Toggles the enable/disable status of a short link.
 * @param {jQuery} element - The clicked badge element.
 */
const toggleLinkStatus = (element) => {
    const linkId = element.data('id');
    const newStatus = !element.hasClass('bg-success');

    const $row = element.closest('.link-row');
    const original = $row.data('original');
    const short = $row.data('short');

    $.ajax({
        url: `/s/status`,
        method: 'PUT',
        data: {
            id: linkId,
            isEnable: newStatus
        },
        success: () => {
            element.toggleClass('bg-success bg-danger').text(newStatus ? 'Enable' : 'Disable');
            showLink(linkId, original, short, newStatus);
        },
        error: () => showAlert('Error updating status.', 'danger')
    });
};

$(document).ready(() => {
    // Handle navigation between content sections
    $('.section-link').on('click', function (e) {
        e.preventDefault();
        const sectionId = $(this).data('section');
        $('.content-section').hide();
        $(`#${sectionId}`).show();
        $('.section-link').removeClass('active');
        $(this).addClass('active');
    });

    // Show link details when a row is clicked
    $(document).on('click', '.link-row', function () {
        const $this = $(this);
        showLink(
            $this.data('id'),
            $this.data('original'),
            $this.data('short'),
            $this.data('isenable')
        );
    });

    // Handle pagination click
    $(document).on('click', '.page-link', function (e) {
        e.preventDefault();
        const page = $(this).data('page');
        loadLinksTable(page);
    });

    // Handle link status toggle
    $(document).on('click', '.status-toggle', function () {
        toggleLinkStatus($(this));
    });

    // Load the initial table data
    loadLinksTable();
});
