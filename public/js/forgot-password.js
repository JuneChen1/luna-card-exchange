const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const emailError = document.getElementById('email-error');
const emailErrorText = document.getElementById('email-error-text');

const ALERT_ICON_PATHS = {
  success:
    '<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>'
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

if (getToken()) {
  location.href = '/dashboard.html';
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

document.getElementById('forgot-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();
  emailError.classList.add('d-none');

  const formData = new FormData(event.target);
  const email = formData.get('email').trim();

  if (!email) {
    emailErrorText.textContent = i18n.t('forgotPassword.enterEmail');
    emailError.classList.remove('d-none');
    return;
  }

  if (!EMAIL_REGEX.test(email)) {
    emailErrorText.textContent = i18n.t('profile.emailInvalid');
    emailError.classList.remove('d-none');
    return;
  }

  try {
    const result = await authApi.forgotPassword(email);
    showAlert(result.message, 'success');
    event.target.reset();
  } catch (error) {
    emailErrorText.textContent = error.message;
    emailError.classList.remove('d-none');
  }
});
