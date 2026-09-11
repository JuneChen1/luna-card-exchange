let allCards = [];
let cardsById = new Map();
let currentUid = '';
let lastExchangeResults = [];

function cardName(card) {
  if (!card) return '';
  return i18n.getLang() === 'en' ? (card.english_name || card.name) : card.name;
}

const authArea = {
  loginBtn: document.getElementById('btn-show-login'),
  registerBtn: document.getElementById('btn-show-register'),
  welcomeDropdown: document.getElementById('welcome-dropdown'),
  logoutBtn: document.getElementById('btn-logout'),
  welcomeText: document.getElementById('welcome-text')
};

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

const exchangeForm = document.getElementById('exchange-form');
const exchangeWantedSelect = document.getElementById('exchange-wanted');
const exchangeOfferedSelect = document.getElementById('exchange-offered');
const exchangeServerSelect = document.getElementById('exchange-server');
const exchangeResults = document.getElementById('exchange-results');
const exchangeResultTemplate = document.getElementById('exchange-result-template');

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
  dashboard.classList.toggle('d-none', !isLoggedIn);

  if (isLoggedIn) {
    authArea.welcomeText.textContent = username;
    loadUidSummaries();
  }
}

async function deleteUid(uid) {
  const confirmed = window.confirm(i18n.t('index.confirmDeleteUid', { uid }));
  if (!confirmed) return false;

  try {
    await myCardsApi.remove(uid);
    return true;
  } catch (error) {
    showAlert(error.message);
    return false;
  }
}

function renderUidList(summaries) {
  uidList.innerHTML = '';

  const separator = i18n.getLang() === 'en' ? ', ' : '、';

  summaries.forEach((summary) => {
    const fragment = uidCardTemplate.content.cloneNode(true);
    const cardEl = fragment.querySelector('.uid-card');
    const uidEl = fragment.querySelector('.uid-card-uid');
    const offeredEl = fragment.querySelector('.uid-card-offered');
    const wantedEl = fragment.querySelector('.uid-card-wanted');
    const deleteBtn = fragment.querySelector('.uid-card-delete');

    i18n.applyI18n(fragment);
    uidEl.textContent = summary.genshin_uid;
    offeredEl.textContent = summary.offered.map((cardId) => cardName(cardsById.get(cardId))).join(separator) || i18n.t('index.none');
    wantedEl.textContent = summary.wanted.map((cardId) => cardName(cardsById.get(cardId))).join(separator) || i18n.t('index.none');

    cardEl.addEventListener('click', () => openEditor(summary.genshin_uid));
    deleteBtn.addEventListener('click', async (event) => {
      event.stopPropagation();
      hideAlert();
      const deleted = await deleteUid(summary.genshin_uid);
      if (!deleted) return;
      showAlert(i18n.t('index.deletedSuccess'), 'success');
      loadUidSummaries();
    });

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

function createCardCheckbox(card, groupId) {
  const wrapper = document.createElement('div');
  wrapper.className = 'form-check';

  const input = document.createElement('input');
  input.className = 'form-check-input';
  input.type = 'checkbox';
  input.value = card.id;
  input.id = `${groupId}-${card.id}`;

  const label = document.createElement('label');
  label.className = 'form-check-label';
  label.setAttribute('for', input.id);
  label.textContent = cardName(card);

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  return wrapper;
}

function populateExchangeCardOptions() {
  const prevWanted = new Set(Array.from(exchangeWantedSelect.querySelectorAll('input:checked')).map((input) => input.value));
  const prevOffered = new Set(Array.from(exchangeOfferedSelect.querySelectorAll('input:checked')).map((input) => input.value));

  exchangeWantedSelect.innerHTML = '';
  exchangeOfferedSelect.innerHTML = '';

  allCards.forEach((card) => {
    const wantedCheckbox = createCardCheckbox(card, 'exchange-wanted');
    const offeredCheckbox = createCardCheckbox(card, 'exchange-offered');

    if (prevWanted.has(String(card.id))) wantedCheckbox.querySelector('input').checked = true;
    if (prevOffered.has(String(card.id))) offeredCheckbox.querySelector('input').checked = true;

    exchangeWantedSelect.appendChild(wantedCheckbox);
    exchangeOfferedSelect.appendChild(offeredCheckbox);
  });
}

function renderCardThumbs(cardIds, container) {
  cardIds.forEach((cardId) => {
    const card = cardsById.get(cardId);
    if (!card) return;

    const chip = document.createElement('span');
    chip.className = 'exchange-card-chip';

    const img = document.createElement('img');
    img.className = 'exchange-card-thumb';
    img.src = card.image_url;
    img.alt = cardName(card);

    const name = document.createElement('span');
    name.textContent = cardName(card);

    chip.appendChild(img);
    chip.appendChild(name);
    container.appendChild(chip);
  });

  if (!container.children.length) container.textContent = i18n.t('index.none');
}

function renderExchangeResults(results) {
  lastExchangeResults = results;
  exchangeResults.innerHTML = '';

  if (results.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'text-muted text-center py-3';
    empty.textContent = i18n.t('index.noResults');
    exchangeResults.appendChild(empty);
    return;
  }

  results.forEach((item) => {
    const fragment = exchangeResultTemplate.content.cloneNode(true);

    i18n.applyI18n(fragment);
    fragment.querySelector('.exchange-result-user').textContent = item.user_name;
    fragment.querySelector('.exchange-result-uid').textContent = item.genshin_uid;
    renderCardThumbs(item.offered_card_ids, fragment.querySelector('.exchange-result-offered'));
    renderCardThumbs(item.wanted_card_ids, fragment.querySelector('.exchange-result-wanted'));
    fragment.querySelector('.exchange-result-contact').textContent = i18n.t('index.contactPrefix')
      + (item.contact_info || i18n.t('index.contactHidden'));

    exchangeResults.appendChild(fragment);
  });
}

async function searchExchange() {
  const wanted = Array.from(exchangeWantedSelect.querySelectorAll('input:checked')).map((input) => input.value);
  const offered = Array.from(exchangeOfferedSelect.querySelectorAll('input:checked')).map((input) => input.value);
  const server = exchangeServerSelect.value;

  try {
    const result = await exchangeApi.search({ wanted, offered, server });
    renderExchangeResults(result.data);
  } catch (error) {
    showAlert(error.message);
  }
}

exchangeForm.addEventListener('submit', (event) => {
  event.preventDefault();
  hideAlert();
  searchExchange();
});

function renderCardsGrid(statusByCardId) {
  cardsGrid.innerHTML = '';

  allCards.forEach((card) => {
    const fragment = cardTemplate.content.cloneNode(true);
    const cardItem = fragment.querySelector('.card-item');
    const img = fragment.querySelector('img');
    const nameEl = fragment.querySelector('.card-name');
    const radios = fragment.querySelectorAll('input[type="radio"]');

    const status = statusByCardId.get(card.id) || 'none';

    i18n.applyI18n(fragment);
    cardItem.dataset.cardId = card.id;
    cardItem.classList.add(`status-${status}`);
    img.src = card.image_url;
    img.alt = cardName(card);
    nameEl.textContent = cardName(card);

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

function collectStatusMap() {
  const map = new Map();

  document.querySelectorAll('.card-item').forEach((cardItem) => {
    const cardId = Number(cardItem.dataset.cardId);
    const checked = cardItem.querySelector('input[type="radio"]:checked');
    map.set(cardId, checked?.value || 'none');
  });

  return map;
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
    showAlert(i18n.t('index.enterUid'));
    return;
  }

  uidInput.value = '';
  openEditor(uid);
});

document.getElementById('btn-back-to-list').addEventListener('click', backToList);

document.getElementById('btn-delete-uid').addEventListener('click', async () => {
  hideAlert();
  const deleted = await deleteUid(currentUid);
  if (!deleted) return;
  showDashboardList();
  showAlert(i18n.t('index.deletedSuccess'), 'success');
  loadUidSummaries();
});

document.getElementById('btn-save').addEventListener('click', async () => {
  hideAlert();

  try {
    await myCardsApi.save(collectStatusPayload());
    showAlert(i18n.t('index.saveSuccess'), 'success');
  } catch (error) {
    showAlert(error.message);
  }
});

document.addEventListener('langchange', () => {
  if (!cardsSection.classList.contains('d-none')) {
    renderCardsGrid(collectStatusMap());
  }
  if (getToken() && !uidListSection.classList.contains('d-none')) {
    loadUidSummaries();
  }
  populateExchangeCardOptions();
  renderExchangeResults(lastExchangeResults);
});

(async function init() {
  await loadCardsCatalog();
  populateExchangeCardOptions();
  searchExchange();
  refreshAuthUI();

  const uidFromUrl = new URLSearchParams(location.search).get('uid');
  if (getToken()) {
    if (uidFromUrl) openEditor(uidFromUrl);
    else showDashboardList();
  }
})();
