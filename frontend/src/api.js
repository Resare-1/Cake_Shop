const API_BASE = 'http://localhost:3001/api';

export function getToken() {
  return localStorage.getItem('token');
}

export async function request(path, options = {}) {
  const headers = options.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) throw await res.json();
  return res.json();
}

export const auth = {
  login: (data) =>
    request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
};

export const menusAPI = {
  list: () => request('/menus')
};
