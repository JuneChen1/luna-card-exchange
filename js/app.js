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
const alertMessage = document.getElementById('alert-message');
const uidListSection = document.getElementById('uid-list-section');
const uidList = document.getElementById('uid-list');
const uidCardTemplate = document.getElementById('uid-card-template');
const cardsSection = document.getElementById('cards-section');
const cardsGrid = document.getElementById('cards-grid');
const uidLabel = document.getElementById('uid-label');
const cardTemplate = document.getElementById('card-template');

function showAlert(message, type = 'danger') {
  alertMessage.textContent = message;
  alertBox.className = `alert alert-dismissible alert-${type}`;
  alertBox.classList.remove('d-none');
}

function hideAlert() {
  alertBox.classList.add('d-none');
}

document.getElementById('btn-alert-close').addEventListener('click', hideAlert);

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
    loadUidSummaries();
  }
}

function renderUidList(summaries) {
  uidList.innerHTML = '';

  summaries.forEach((summary) => {
    const fragment = uidCardTemplate.content.cloneNode(true);
    const cardEl = fragment.querySelector('.uid-card');
    const uidEl = fragment.querySelector('.uid-card-uid');
    const offeredEl = fragment.querySelector('.uid-card-offered');
    const wantedEl = fragment.querySelector('.uid-card-wanted');

    uidEl.textContent = summary.genshin_uid;
    offeredEl.textContent = summary.offered.map((card) => card.name).join('、') || '無';
    wantedEl.textContent = summary.wanted.map((card) => card.name).join('、') || '無';

    cardEl.addEventListener('click', () => openEditor(summary.genshin_uid));

    uidList.appendChild(fragment);
  });
}

async function loadUidSummaries() {
  try {
    const result = await myCardsApi.listUids();
    renderUidList(result.data);
  } catch (error) {
    showAlert(error.message);
  }
}

async function openEditor(uid) {
  hideAlert();

  try {
    const result = await myCardsApi.get(uid);
    const statusByCardId = new Map(result.data.map((item) => [item.card.id, item.status]));

    currentUid = uid;
    uidLabel.textContent = uid;
    renderCardsGrid(statusByCardId);
    uidListSection.classList.add('d-none');
    cardsSection.classList.remove('d-none');
    history.replaceState(null, '', `?uid=${encodeURIComponent(uid)}`);
  } catch (error) {
    showAlert(error.message);
  }
}

function showDashboardList() {
  cardsSection.classList.add('d-none');
  uidListSection.classList.remove('d-none');
  history.replaceState(null, '', '?page=dashboard');
}

function backToList() {
  hideAlert();
  showDashboardList();
  loadUidSummaries();
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
    setSession(result.data.token, username);
    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();
    event.target.reset();
    refreshAuthUI();
    showDashboardList();
  } catch (error) {
    showAlert(error.message);
  }
});

authArea.logoutBtn.addEventListener('click', () => {
  clearSession();
  cardsSection.classList.add('d-none');
  uidListSection.classList.remove('d-none');
  history.replaceState(null, '', location.pathname);
  refreshAuthUI();
});

document.getElementById('btn-add-uid').addEventListener('click', () => {
  hideAlert();
  const uidInput = document.getElementById('new-uid-input');
  const uid = uidInput.value.trim();

  if (!uid) {
    showAlert('請輸入原神 UID');
    return;
  }

  uidInput.value = '';
  openEditor(uid);
});

document.getElementById('btn-back-to-list').addEventListener('click', backToList);

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

  const uidFromUrl = new URLSearchParams(location.search).get('uid');
  if (getToken()) {
    if (uidFromUrl) openEditor(uidFromUrl);
    else showDashboardList();
  }
})();
