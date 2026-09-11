let allCards = [];
let cardsById = new Map();
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

const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');

const exchangeForm = document.getElementById('exchange-form');
const exchangeFilterBody = document.getElementById('exchange-filter-body');
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

  if (isLoggedIn) {
    authArea.welcomeText.textContent = username;
  }
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

  const isEmpty = !container.children.length;
  container.classList.toggle('is-empty', isEmpty);
  if (isEmpty) container.textContent = i18n.t('index.none');
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
    fragment.querySelector('.exchange-result-uid').textContent = i18n.t('index.uidLabel') + item.genshin_uid;
    renderCardThumbs(item.offered_card_ids, fragment.querySelector('.exchange-result-offered'));
    renderCardThumbs(item.wanted_card_ids, fragment.querySelector('.exchange-result-wanted'));

    const hasContact = Boolean(item.contact_info);
    const contactBadge = fragment.querySelector('.exchange-result-contact');
    contactBadge.classList.toggle('has-contact', hasContact);
    contactBadge.classList.toggle('no-contact', !hasContact);
    fragment.querySelector('.exchange-result-contact-text').textContent = hasContact
      ? item.contact_info
      : i18n.t('index.contactHidden');

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
  bootstrap.Collapse.getOrCreateInstance(exchangeFilterBody).hide();
});

authArea.logoutBtn.addEventListener('click', () => {
  clearSession();
  refreshAuthUI();
});

document.addEventListener('langchange', () => {
  populateExchangeCardOptions();
  renderExchangeResults(lastExchangeResults);
});

(async function init() {
  await loadCardsCatalog();
  populateExchangeCardOptions();
  searchExchange();
  refreshAuthUI();
})();
