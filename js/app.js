let allCards = [];
let currentUid = '';

const authArea = {
  loginBtn: document.getElementById('btn-show-login'),
  registerBtn: document.getElementById('btn-show-register'),
  logoutBtn: document.getElementById('btn-logout'),
  welcomeText: document.getElementById('welcome-text')
};

const guestHint = document.getElementById('guest-hint');
const dashboard = document.getElementById('dashboard');
const alertBox = document.getElementById('alert-box');
const cardsSection = document.getElementById('cards-section');
const cardsGrid = document.getElementById('cards-grid');
const uidLabel = document.getElementById('uid-label');
const cardTemplate = document.getElementById('card-template');

function showAlert(message, type = 'danger') {
  alertBox.textContent = message;
  alertBox.className = `alert alert-${type}`;
  alertBox.classList.remove('d-none');
}

function hideAlert() {
  alertBox.classList.add('d-none');
}

function refreshAuthUI() {
  const token = getToken();
  const username = localStorage.getItem(USERNAME_KEY);
  const isLoggedIn = Boolean(token);

  authArea.loginBtn.classList.toggle('d-none', isLoggedIn);
  authArea.registerBtn.classList.toggle('d-none', isLoggedIn);
  authArea.logoutBtn.classList.toggle('d-none', !isLoggedIn);
  authArea.welcomeText.classList.toggle('d-none', !isLoggedIn);
  guestHint.classList.toggle('d-none', isLoggedIn);
  dashboard.classList.toggle('d-none', !isLoggedIn);

  if (isLoggedIn) {
    authArea.welcomeText.textContent = `你好，${username}`;
  }
}

async function loadCardsCatalog() {
  const response = await fetch('/data/cards.json');
  allCards = await response.json();
}

function renderCardsGrid(statusByCardId) {
  cardsGrid.innerHTML = '';

  allCards.forEach((card) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const cardItem = fragment.querySelector('.card-item');
    const img = fragment.querySelector('img');
    const nameEl = fragment.querySelector('.card-name');
    const radios = fragment.querySelectorAll('input[type="radio"]');

    const status = statusByCardId.get(card.id) || 'none';

    cardItem.dataset.cardId = card.id;
    cardItem.classList.add(`status-${status}`);
    img.src = card.image_url;
    img.alt = card.name;
    nameEl.textContent = card.name;

    radios.forEach((radio) => {
      const radioId = `status-${card.id}-${radio.value}`;
      const label = radio.nextElementSibling;

      radio.id = radioId;
      radio.name = `status-${card.id}`;
      radio.checked = radio.value === status;
      label.setAttribute('for', radioId);

      radio.addEventListener('change', () => {
        cardItem.classList.remove('status-none', 'status-offered', 'status-wanted');
        cardItem.classList.add(`status-${radio.value}`);
      });
    });

    cardsGrid.appendChild(fragment);
  });
}

function collectStatusPayload() {
  const offered = [];
  const wanted = [];

  document.querySelectorAll('.card-item').forEach((cardItem) => {
    const cardId = Number(cardItem.dataset.cardId);
    const checked = cardItem.querySelector('input[type="radio"]:checked');

    if (checked?.value === 'offered') offered.push(cardId);
    if (checked?.value === 'wanted') wanted.push(cardId);
  });

  return { genshinUid: currentUid, offered, wanted };
}

document.getElementById('register-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);

  try {
    await authApi.register({
      username: formData.get('username'),
      password: formData.get('password'),
      contact_info: formData.get('contact_info') || undefined
    });
    showAlert('註冊成功，請登入', 'success');
    bootstrap.Modal.getInstance(document.getElementById('registerModal'))?.hide();
    event.target.reset();
  } catch (error) {
    showAlert(error.message);
  }
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  hideAlert();

  const formData = new FormData(event.target);
  const username = formData.get('username');

  try {
    const result = await authApi.login({ username, password: formData.get('password') });
    setSession(result.token, username);
    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    event.target.reset();
    refreshAuthUI();
  } catch (error) {
    showAlert(error.message);
  }
});

authArea.logoutBtn.addEventListener('click', () => {
  clearSession();
  cardsSection.classList.add('d-none');
  refreshAuthUI();
});

document.getElementById('btn-load-uid').addEventListener('click', async () => {
  hideAlert();
  const uid = document.getElementById('uid-input').value.trim();

  if (!uid) {
    showAlert('請輸入原神 UID');
    return;
  }

  try {
    const result = await myCardsApi.get(uid);
    const statusByCardId = new Map((result.cards || result || []).map((item) => [item.cardId ?? item.card_id, item.status]));

    currentUid = uid;
    uidLabel.textContent = uid;
    renderCardsGrid(statusByCardId);
    cardsSection.classList.remove('d-none');
  } catch (error) {
    showAlert(error.message);
  }
});

document.getElementById('btn-save').addEventListener('click', async () => {
  hideAlert();

  try {
    await myCardsApi.save(collectStatusPayload());
    showAlert('儲存成功', 'success');
  } catch (error) {
    showAlert(error.message);
  }
});

(async function init() {
  await loadCardsCatalog();
  refreshAuthUI();
})();
