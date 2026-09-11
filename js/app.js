let allCards = [];
let cardsById = new Map();
let currentUid = '';

const authArea = {
  loginBtn: document.getElementById('btn-show-login'),
  registerBtn: document.getElementById('btn-show-register'),
  welcomeDropdown: document.getElementById('welcome-dropdown'),
  logoutBtn: document.getElementById('btn-logout'),
  welcomeText: document.getElementById('welcome-text')
};

const guestHint = document.getElementById('guest-hint');
const dashboard = document.getElementById('dashboard');
const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const uidListSection = document.getElementById('uid-list-section');
const uidList = document.getElementById('uid-list');
const uidCardTemplate = document.getElementById('uid-card-template');
const cardsSection = document.getElementById('cards-section');
const cardsGrid = document.getElementById('cards-grid');
const uidLabel = document.getElementById('uid-label');
const cardTemplate = document.getElementById('card-template');

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

function refreshAuthUI() {
  const token = getToken();
  const username = localStorage.getItem(USERNAME_KEY);
  const isLoggedIn = Boolean(token);

  authArea.loginBtn.classList.toggle('d-none', isLoggedIn);
  authArea.registerBtn.classList.toggle('d-none', isLoggedIn);
  authArea.welcomeDropdown.classList.toggle('d-none', !isLoggedIn);
  guestHint.classList.toggle('d-none', isLoggedIn);
  dashboard.classList.toggle('d-none', !isLoggedIn);

  if (isLoggedIn) {
    authArea.welcomeText.textContent = username;
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
    offeredEl.textContent = summary.offered.map((cardId) => cardsById.get(cardId)?.name).join('、') || '無';
    wantedEl.textContent = summary.wanted.map((cardId) => cardsById.get(cardId)?.name).join('、') || '無';

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
  cardsById = new Map(allCards.map((card) => [card.id, card]));
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
