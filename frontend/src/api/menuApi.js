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
router.post('/', authenticateJWT, async (req, res) => {
  const { MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom, Ingredients } = req.body;
  if (!MenuName || !MenuPrice || !MenuDescription || !Bake_Time || !Ingredients?.length) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [menuResult] = await pool.query(
      'INSERT INTO menu (MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom, Is_Available) VALUES (?, ?, ?, ?, ?, true)',
      [MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom]
    );

    const menuID = menuResult.insertId;

    const ingredientValues = Ingredients.map(i => [menuID, i.IngredientID, i.qty_required]);
    if (ingredientValues.length > 0) {
      await pool.query(
        'INSERT INTO menu_ingredient (MenuID, IngredientID, qty_required) VALUES ?',
        [ingredientValues]
      );
    }

    res.json({ MenuID: menuID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add menu' });
  }
});