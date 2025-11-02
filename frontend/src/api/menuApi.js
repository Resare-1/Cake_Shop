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
//
// ✅✅✅ เพิ่ม 3 ฟังก์ชันใหม่
//

// ดึงเมนูตาม ID
export const getMenuById = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch menu');
  return await res.json();
};

// แก้ไขข้อมูลเมนู
export const updateMenu = async (id, updatedMenu) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedMenu),
  });
  if (!res.ok) throw new Error('Failed to update menu');
  return await res.json();
};

// ลบเมนู
export const deleteMenu = async (id) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete menu');
  return await res.json();
};
export const updateMenuIngredients = async (id, ingredients) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/${id}/ingredients`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ Ingredients: ingredients }),
  });
  if (!res.ok) throw new Error('Failed to update menu ingredients');
  return await res.json();
};
