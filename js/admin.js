if (!getToken()) {
  location.href = '/login.html';
}

if (getUserRole() !== 'ADMIN') {
  location.href = '/';
}

const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');

const ALERT_ICON_PATHS = {
  success:
    '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>',
  danger:
    '<path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>'
};

function showAlert(message, type = 'danger') {
  alertIcon.innerHTML = ALERT_ICON_PATHS[type] || '';
  alertMessage.textContent = message;
  alertBox.className = `alert alert-dismissible d-flex align-items-center alert-${type}`;
  alertBox.classList.remove('d-none');
}

function hideAlert() {
  alertBox.classList.add('d-none');
}

document.getElementById('btn-alert-close').addEventListener('click', hideAlert);

document.getElementById('welcome-text').textContent = localStorage.getItem(USERNAME_KEY);
refreshAdminNav();

document.getElementById('btn-logout').addEventListener('click', () => {
  clearSession();
  location.href = '/';
});

const searchForm = document.getElementById('admin-search-form');
const keywordInput = document.getElementById('admin-keyword');
const bannedSelect = document.getElementById('admin-banned');
const userList = document.getElementById('admin-user-list');
const rowTemplate = document.getElementById('admin-row-template');
const noResults = document.getElementById('admin-no-results');
const pageInfo = document.getElementById('admin-page-info');
const prevPageBtn = document.getElementById('admin-prev-page');
const nextPageBtn = document.getElementById('admin-next-page');

let currentPage = 1;
let currentTotalPages = 1;

function renderRow(user) {
  const fragment = rowTemplate.content.cloneNode(true);

  fragment.querySelector('.admin-row-name').textContent = user.name;
  fragment.querySelector('.admin-row-email').textContent = user.email || '-';
  fragment.querySelector('.admin-row-contact').textContent = user.contact_info || '-';
  fragment.querySelector('.admin-row-role').textContent = user.role;

  const statusBadge = fragment.querySelector('.admin-row-status-badge');
  statusBadge.textContent = user.is_banned
    ? i18n.t('admin.statusBanned')
    : i18n.t('admin.statusActive');
  statusBadge.classList.add(user.is_banned ? 'bg-danger' : 'bg-success');

  const actionBtn = fragment.querySelector('.admin-row-action');
  actionBtn.textContent = user.is_banned ? i18n.t('admin.unban') : i18n.t('admin.ban');
  actionBtn.classList.add(user.is_banned ? 'btn-outline-luna-primary' : 'btn-outline-danger');
  actionBtn.addEventListener('click', () => handleToggleBan(user));

  return fragment;
}

async function handleToggleBan(user) {
  const confirmKey = user.is_banned ? 'admin.confirmUnban' : 'admin.confirmBan';
  const confirmed = window.confirm(i18n.t(confirmKey, { name: user.name }));
  if (!confirmed) return;

  try {
    if (user.is_banned) {
      await adminApi.unbanUser(user.id);
      showAlert(i18n.t('admin.unbanSuccess', { name: user.name }), 'success');
    } else {
      await adminApi.banUser(user.id);
      showAlert(i18n.t('admin.banSuccess', { name: user.name }), 'success');
    }
    loadUsers(currentPage);
  } catch (error) {
    showAlert(error.message);
  }
}

async function loadUsers(page = 1) {
  hideAlert();

  try {
    const result = await adminApi.searchUsers({
      keyword: keywordInput.value.trim(),
      banned: bannedSelect.value,
      page,
      limit: 20
    });

    const { users, pagination } = result.data;
    currentPage = pagination.page;
    currentTotalPages = Math.max(pagination.total_pages, 1);

    userList.innerHTML = '';
    users.forEach((user) => userList.appendChild(renderRow(user)));

    noResults.classList.toggle('d-none', users.length > 0);
    pageInfo.textContent = i18n.t('admin.pageInfo', {
      page: currentPage,
      totalPages: currentTotalPages,
      total: pagination.total
    });
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= currentTotalPages;
  } catch (error) {
    showAlert(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  loadUsers(1);
});

prevPageBtn.addEventListener('click', () => {
  if (currentPage > 1) loadUsers(currentPage - 1);
});

nextPageBtn.addEventListener('click', () => {
  if (currentPage < currentTotalPages) loadUsers(currentPage + 1);
});

loadUsers(1);
