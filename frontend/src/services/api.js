const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = localStorage.getItem('worldly_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

// Generic fetch handler
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const includeAuth = options.auth !== false;
  const config = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...(options.headers || {}),
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `API error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API call failed for [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

// Auth API
export const authAPI = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload), auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload), auth: false }),
  getMe: () => request('/auth/me'),
  updateProfile: (payload) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(payload) }),
};

// Tasks API
export const taskAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/tasks/${id}`),
  create: (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) }),
  update: (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// Countries API
export const countryAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/countries${query ? `?${query}` : ''}`, { auth: false });
  },
  getById: (id) => request(`/countries/${id}`, { auth: false }),
};

// Bookmarks API
export const bookmarkAPI = {
  getAll: () => request('/bookmarks'),
  toggle: (countryId, notes = '') => request(`/bookmarks/${countryId}`, { method: 'POST', body: JSON.stringify({ notes }) }),
  remove: (countryId) => request(`/bookmarks/${countryId}`, { method: 'DELETE' }),
};

// Quiz API
export const quizAPI = {
  getDaily: () => request('/quiz/daily', { auth: false }),
  submitAnswer: (questionId, optionId) =>
    request('/quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ questionId, optionId }),
    }),
};

