// frontend/src/api/menusApi.js
export const getMenus = async () => {
  const token = localStorage.getItem('token'); // ดึง token จาก localStorage

  const res = await fetch('http://localhost:3006/api/menus', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch menus');
  }

  return await res.json();
};
