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

function getUserRole() {
  const token = getToken();
  if (!token) return null;

  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(payload)).role || null;
  } catch (error) {
    return null;
  }
}

function refreshAdminNav() {
  const item = document.getElementById('nav-admin-item');
  if (item) item.classList.toggle('d-none', getUserRole() !== 'ADMIN');
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
    throw new Error(data.message || i18n.t('common.requestFailed'));
  }

  return data;
}

const authApi = {
  register(payload) {
    return apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
  },
  login(payload) {
    return apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
  },
  forgotPassword(email) {
    return apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
  },
  resetPassword(payload) {
    return apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) });
  }
};

const profileApi = {
  getMe() {
    return apiRequest('/users/me');
  },
  updateMe(payload) {
    return apiRequest('/users/me', { method: 'PATCH', body: JSON.stringify(payload) });
  },
  updatePassword(payload) {
    return apiRequest('/users/me/password', { method: 'PATCH', body: JSON.stringify(payload) });
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
  },
  remove(genshinUid) {
    return apiRequest(`/my-cards?uid=${encodeURIComponent(genshinUid)}`, { method: 'DELETE' });
  }
};

const adminApi = {
  searchUsers({ keyword = '', banned = '', page = 1, limit = 20 } = {}) {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (banned) params.set('banned', banned);
    params.set('page', page);
    params.set('limit', limit);
    return apiRequest(`/admin/users?${params.toString()}`);
  },
  banUser(id) {
    return apiRequest(`/admin/users/${id}/ban`, { method: 'PATCH' });
  },
  unbanUser(id) {
    return apiRequest(`/admin/users/${id}/unban`, { method: 'PATCH' });
  }
};

const exchangeApi = {
  search({ wanted = [], offered = [], server = '' } = {}) {
    const params = new URLSearchParams();
    if (wanted.length) params.set('wanted', wanted.join(','));
    if (offered.length) params.set('offered', offered.join(','));
    if (server) params.set('server', server);

    const query = params.toString();
    return apiRequest(`/exchange${query ? `?${query}` : ''}`);
  }
};
