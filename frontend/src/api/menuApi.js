// frontend/src/api/menusApi.js
const BASE_URL = 'http://localhost:3006/api/menus';

export const getMenus = async () => {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch menus');
  const data = await res.json();
  return data.map(m => ({
    ...m,
    Ingredients: m.Ingredients || [],
  }));
};

export const addMenu = async (menu) => {
  const token = localStorage.getItem('token');
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menu),
  });
  if (!res.ok) throw new Error('Failed to add menu');
  return await res.json();
};

export const toggleMenuStatus = async (id, Is_Available) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}/toggle`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Is_Available }),
  });
  if (!res.ok) throw new Error('Failed to update menu');
  return await res.json();
};
