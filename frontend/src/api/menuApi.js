// api/menusApi.js
export const getMenus = async () => {
  // simulate network delay
  await new Promise(res => setTimeout(res, 300));

  // mock data
  return [
    { id: 1, name: 'Chocolate Cake', description: 'Rich dark chocolate cake', image: 'https://via.placeholder.com/80' },
    { id: 2, name: 'Vanilla Cake', description: 'Classic vanilla cream cake', image: 'https://via.placeholder.com/80' },
    { id: 3, name: 'Strawberry Cake', description: 'Fresh strawberry cake', image: 'https://via.placeholder.com/80' },
    { id: 4, name: 'Lemon Cake', description: 'Tangy lemon cake', image: 'https://via.placeholder.com/80' },
    { id: 5, name: 'Red Velvet', description: 'Velvety red cake', image: 'https://via.placeholder.com/80' },
  ];

  // later replace with real fetch:
  // const res = await fetch('/api/menus'); << backend endpoint
  // if (!res.ok) throw new Error('Failed to fetch menus');
  // return await res.json();
};
