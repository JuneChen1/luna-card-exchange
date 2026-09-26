if (!getToken()) {
  location.href = 'login.html';
}

let allCards = [];
let cardsById = new Map();
let currentUid = '';
let savedStatusMap = new Map();

function cardName(card) {
  if (!card) return '';
  const lang = i18n.getLang();
  if (lang === 'en') return card.english_name || card.name;
  if (lang === 'ja') return card.japanese_name || card.name;
  if (lang === 'ko') return card.korean_name || card.name;
  return card.name;
}

const alertBox = document.getElementById('alert-box');
const alertMessage = document.getElementById('alert-message');
const alertIcon = document.getElementById('alert-icon');
const uidListSection = document.getElementById('uid-list-section');
const uidList = document.getElementById('uid-list');
const uidListEmpty = document.getElementById('uid-list-empty');
const uidCardTemplate = document.getElementById('uid-card-template');
const cardsSection = document.getElementById('cards-section');
const cardsGrid = document.getElementById('cards-grid');
const uidLabel = document.getElementById('uid-label');
const cardTemplate = document.getElementById('card-template');
const unsavedUidNotice = document.getElementById('unsaved-uid-notice');

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
  alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function hideAlert() {
  alertBox.classList.add('d-none');
}

const addUidError = document.getElementById('add-uid-error');
const addUidErrorIcon = document.getElementById('add-uid-error-icon');
const addUidErrorMessage = document.getElementById('add-uid-error-message');

function showAddUidError(message) {
  addUidErrorIcon.innerHTML = ALERT_ICON_PATHS.danger;
  addUidErrorMessage.textContent = message;
  addUidError.classList.remove('d-none');
}

function hideAddUidError() {
  addUidError.classList.add('d-none');
}

document.getElementById('btn-add-uid-error-close').addEventListener('click', hideAddUidError);

document.getElementById('btn-alert-close').addEventListener('click', hideAlert);

document.getElementById('welcome-text').textContent = localStorage.getItem(USERNAME_KEY);
refreshAdminNav();

document.getElementById('btn-logout').addEventListener('click', () => {
  clearSession();
  location.href = 'index.html';
});

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

async function setUidVisibility(uid, isPublic) {
  try {
    await myCardsApi.setVisibility(uid, isPublic);
    return true;
  } catch (error) {
    showAlert(error.message);
    return false;
  }
}

function serverLabelForUid(uid) {
  if (/^18/.test(uid)) return 'Asia';
  const prefix = uid[0];
  if (prefix === '7') return 'Europe';
  if (prefix === '6') return 'America';
  if (prefix === '8') return 'Asia';
  if (prefix === '9') return 'TW,HK,MO';
  return '';
}

function cardNamesText(cardIds) {
  const separator = i18n.t('index.shareListSeparator');
  return cardIds.map((id) => cardName(cardsById.get(id))).filter(Boolean).join(separator);
}

function buildShareText(summary) {
  const server = serverLabelForUid(summary.genshin_uid);
  const offeredText = cardNamesText(summary.offered) || i18n.t('index.none');
  const wantedText = cardNamesText(summary.wanted) || i18n.t('index.none');
  const uidLine = `${i18n.t('index.uidLabel')}${summary.genshin_uid}`;

  const lines = [];
  if (server) lines.push(server);
  lines.push(uidLine);
  lines.push(i18n.t('index.shareOfferedLine', { list: offeredText }));
  lines.push(i18n.t('index.shareWantedLine', { list: wantedText }));

  return lines.join('\n');
}

const shareTextModalEl = document.getElementById('share-text-modal');
const shareTextModal = new bootstrap.Modal(shareTextModalEl);
const shareTextContent = document.getElementById('share-text-content');
const shareCopyFeedback = document.getElementById('share-copy-feedback');

function openShareTextModal(summary) {
  shareTextContent.value = buildShareText(summary);
  shareCopyFeedback.classList.add('d-none');
  shareTextModal.show();
}

shareTextContent.addEventListener('click', () => shareTextContent.select());

document.getElementById('btn-copy-share-text').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(shareTextContent.value);
    if (typeof gtag === 'function') gtag('event', 'copy_share_text');
    shareCopyFeedback.textContent = i18n.t('index.shareCopied');
    shareCopyFeedback.classList.remove('d-none', 'text-danger');
    shareCopyFeedback.classList.add('text-success');
  } catch (error) {
    shareTextContent.focus();
    shareTextContent.select();
    shareCopyFeedback.textContent = i18n.t('index.shareCopyFailed');
    shareCopyFeedback.classList.remove('d-none', 'text-success');
    shareCopyFeedback.classList.add('text-danger');
  }
});

function renderCardChips(cardIds, container) {
  cardIds.forEach((cardId) => {
    const card = cardsById.get(cardId);
    if (!card) return;

    const chip = document.createElement('span');
    chip.className = 'exchange-card-chip';
    chip.title = cardName(card);

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

function renderUidList(summaries) {
  uidList.innerHTML = '';
  uidListEmpty.classList.toggle('d-none', summaries.length > 0);

  summaries.forEach((summary) => {
    const fragment = uidCardTemplate.content.cloneNode(true);
    const uidEl = fragment.querySelector('.uid-card-uid');
    const offeredEl = fragment.querySelector('.uid-card-offered');
    const wantedEl = fragment.querySelector('.uid-card-wanted');
    const shareBtn = fragment.querySelector('.uid-card-share');
    const visibilitySwitch = fragment.querySelector('.uid-card-visibility');
    const privateBadge = fragment.querySelector('.uid-card-private-badge');
    const deleteBtn = fragment.querySelector('.uid-card-delete');

    i18n.applyI18n(fragment);
    uidEl.innerHTML = '';
    const uidArrow = document.createElement('span');
    uidArrow.className = 'uid-arrow-icon';
    uidArrow.setAttribute('aria-hidden', 'true');
    uidArrow.textContent = '▸';
    const uidText = document.createElement('span');
    uidText.className = 'uid-card-uid-text';
    uidText.textContent = i18n.t('index.uidLabel') + summary.genshin_uid;
    uidEl.append(uidArrow, uidText);
    renderCardChips(summary.offered, offeredEl);
    renderCardChips(summary.wanted, wantedEl);

    const activate = () => openEditor(summary.genshin_uid);
    uidEl.addEventListener('click', activate);
    uidEl.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
    shareBtn.addEventListener('click', () => openShareTextModal(summary));
    privateBadge.classList.toggle('d-none', summary.is_public);
    visibilitySwitch.checked = summary.is_public;

    visibilitySwitch.addEventListener('change', async () => {
      hideAlert();
      visibilitySwitch.disabled = true;
      const nextIsPublic = visibilitySwitch.checked;
      const updated = await setUidVisibility(summary.genshin_uid, nextIsPublic);
      if (!updated) {
        visibilitySwitch.checked = !nextIsPublic;
        visibilitySwitch.disabled = false;
        return;
      }
      showAlert(
        i18n.t(nextIsPublic ? 'index.madePublicSuccess' : 'index.madePrivateSuccess', {
          uid: summary.genshin_uid
        }),
        'success'
      );
      loadUidSummaries();
    });

    deleteBtn.addEventListener('click', async () => {
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

async function openEditor(uid, { onError } = {}) {
  hideAlert();

  try {
    const result = await myCardsApi.get(uid);
    const statusByCardId = new Map(result.data.map((item) => [item.card.id, item.status]));

    currentUid = uid;
    savedStatusMap = statusByCardId;
    uidLabel.textContent = uid;
    renderCardsGrid(statusByCardId);
    unsavedUidNotice.classList.toggle('d-none', result.data.length > 0);
    uidListSection.classList.add('d-none');
    cardsSection.classList.remove('d-none');
    history.replaceState(null, '', `?uid=${encodeURIComponent(uid)}`);
    return true;
  } catch (error) {
    if (onError) onError(error);
    else showAlert(error.message);
    return false;
  }
}

function showList() {
  cardsSection.classList.add('d-none');
  uidListSection.classList.remove('d-none');
  history.replaceState(null, '', location.pathname);
}

function backToList() {
  hideAlert();
  hideAddUidError();
  document.getElementById('new-uid-input').value = '';
  showList();
  loadUidSummaries();
}

async function loadCardsCatalog() {
  const response = await fetch('data/cards.json');
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
        const hasAnyStatus = document.querySelector(
          '.card-item input[type="radio"]:checked[value="offered"], .card-item input[type="radio"]:checked[value="wanted"]'
        );
        unsavedUidNotice.classList.toggle('d-none', Boolean(hasAnyStatus));
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

function hasUnsavedChanges() {
  const currentStatusMap = collectStatusMap();
  return allCards.some(
    (card) => (currentStatusMap.get(card.id) || 'none') !== (savedStatusMap.get(card.id) || 'none')
  );
}

const GENSHIN_UID_REGEX = /^(6\d{8}|7\d{8}|9\d{8}|18\d{8}|8\d{8})$/;

document.getElementById('btn-add-uid').addEventListener('click', async () => {
  hideAlert();
  hideAddUidError();
  const uidInput = document.getElementById('new-uid-input');
  const uid = uidInput.value.trim();

  if (!uid) {
    showAddUidError(i18n.t('index.enterUid'));
    return;
  }

  if (!GENSHIN_UID_REGEX.test(uid)) {
    showAddUidError(i18n.t('index.uidFormatError'));
    return;
  }

  const success = await openEditor(uid, { onError: (error) => showAddUidError(error.message) });
  if (success) uidInput.value = '';
});

document.getElementById('btn-back-to-list').addEventListener('click', () => {
  if (hasUnsavedChanges() && !window.confirm(i18n.t('index.confirmDiscardChanges'))) return;
  backToList();
});

document.getElementById('btn-save').addEventListener('click', async () => {
  hideAlert();

  const payload = collectStatusPayload();
  if (payload.offered.length === 0 && payload.wanted.length === 0) return;

  const isNewUid = savedStatusMap.size === 0;

  try {
    await myCardsApi.save(payload);
    if (isNewUid && typeof gtag === 'function') gtag('event', 'add_uid');
    backToList();
    showAlert(i18n.t('index.saveSuccess'), 'success');
  } catch (error) {
    showAlert(error.message);
  }
});

document.addEventListener('langchange', () => {
  if (!cardsSection.classList.contains('d-none')) {
    renderCardsGrid(collectStatusMap());
  } else {
    loadUidSummaries();
  }
});

(async function init() {
  if (typeof gtag === 'function') gtag('event', 'view_dashboard');

  await loadCardsCatalog();
  loadUidSummaries();

  const uidFromUrl = new URLSearchParams(location.search).get('uid');
  if (uidFromUrl) openEditor(uidFromUrl);
})();
