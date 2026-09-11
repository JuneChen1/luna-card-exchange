const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const newPasswordError = document.getElementById('new-password-error');
const newPasswordErrorText = document.getElementById('new-password-error-text');

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

if (!getToken()) {
  location.href = '/login.html';
}

document.getElementById('welcome-text').textContent = localStorage.getItem(USERNAME_KEY);

document.getElementById('btn-logout').addEventListener('click', () => {
  clearSession();
  location.href = '/';
});

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

document.getElementById('password-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();
  newPasswordError.classList.add('d-none');

  const formData = new FormData(event.target);
  const oldPassword = formData.get('old_password');
  const newPassword = formData.get('new_password');
  const confirmPassword = formData.get('confirm_password');

  if (!PASSWORD_REGEX.test(newPassword)) {
    newPasswordErrorText.textContent = i18n.t('common.passwordRule');
    newPasswordError.classList.remove('d-none');
    return;
  }

  if (newPassword !== confirmPassword) {
    newPasswordErrorText.textContent = i18n.t('common.newPasswordMismatch');
    newPasswordError.classList.remove('d-none');
    return;
  }

  try {
    await profileApi.updatePassword({
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword
    });
    showAlert(i18n.t('changePassword.updateSuccess'), 'success');
    event.target.reset();
  } catch (error) {
    showAlert(error.message);
  }
});
