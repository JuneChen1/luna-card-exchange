const API_BASE = '/api';
const TOKEN_KEY = 'luna_token';
const USERNAME_KEY = 'luna_username';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, username) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USERNAME_KEY, username);
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
}

async function apiRequest(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || '請求失敗');
  }

  return data;
}

const authApi = {
  register(payload) {
    return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  login(payload) {
    return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  }
};

const myCardsApi = {
  listUids() {
    return apiRequest('/my-cards/uids');
  },
  get(genshinUid) {
    return apiRequest(`/my-cards?uid=${encodeURIComponent(genshinUid)}`);
  },
  save(payload) {
    return apiRequest('/my-cards', { method: 'POST', body: JSON.stringify(payload) });
  }
};
