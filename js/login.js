const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const passwordError = document.getElementById('password-error');
const passwordErrorText = document.getElementById('password-error-text');

const ALERT_ICON_PATHS = {
  success:
    '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>'
};

function showAlert(message, type = 'danger') {
  if (type === 'danger') {
    passwordErrorText.textContent = message;
    passwordError.classList.remove('d-none');
    return;
  }

  alertIcon.innerHTML = ALERT_ICON_PATHS[type] || '';
  alertMessage.textContent = message;
  alertBox.className = `alert alert-dismissible d-flex align-items-center alert-${type}`;
  alertBox.classList.remove('d-none');
}

function hideAlert() {
  alertBox.classList.add('d-none');
  passwordError.classList.add('d-none');
}

document.getElementById('btn-alert-close').addEventListener('click', hideAlert);

if (getToken()) {
  location.href = '/';
}

if (new URLSearchParams(location.search).get('registered')) {
  showAlert(i18n.t('login.registeredSuccess'), 'success');
}

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);
  const username = formData.get('username').trim();
  const password = formData.get('password');

  if (!username || !password) {
    showAlert(i18n.t('login.enterBoth'));
    return;
  }

  try {
    const result = await authApi.login({ username, password });
    setSession(result.data.token, username);
    location.href = '/';
  } catch (error) {
    showAlert(error.message);
  }
});
