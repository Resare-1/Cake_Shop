const BASE_URL = 'http://localhost:3006/api/login';

export const loginUser = async (username, password) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.error || 'Login failed');
  }

  return await res.json(); // { token: '...', user: {...} }
};
