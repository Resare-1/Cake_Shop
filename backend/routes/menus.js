// backend/routes/menu.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// backend/routes/menus.js
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query(`
    SELECT 
      m.MenuID, m.MenuName, m.MenuPrice, m.MenuDescription, m.Bake_Time, m.Is_Custom, m.Is_Available,
      i.IngredientID, i.IngredientName, i.Unit, mi.qty_required
    FROM menu m
    LEFT JOIN menu_ingredient mi ON m.MenuID = mi.MenuID
    LEFT JOIN ingredient i ON mi.IngredientID = i.IngredientID
    `);

    const menus = [];
    const menuMap = {};

    for (const row of rows) {
      if (!menuMap[row.MenuID]) {
        menuMap[row.MenuID] = { 
          MenuID: row.MenuID,
          MenuName: row.MenuName,
          MenuPrice: row.MenuPrice,
          MenuDescription: row.MenuDescription,
          Bake_Time: row.Bake_Time,
          Is_Custom: row.Is_Custom,
          Is_Available: row.Is_Available,
          Ingredients: []
        };
        menus.push(menuMap[row.MenuID]);
      }

          if (row.IngredientID) {
      menuMap[row.MenuID].Ingredients.push({
        IngredientID: row.IngredientID,
        IngredientName: row.IngredientName,
        qty_required: row.qty_required,
        Unit: row.Unit,   // ✅ เพิ่มหน่วย
      });
    }
    }

    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});
// PUT /api/menus/:id/toggle
router.put('/:id/toggle', authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  const { Is_Available } = req.body;

  try {
    await pool.query('UPDATE menu SET Is_Available = ? WHERE MenuID = ?', [Is_Available, menuID]);
    res.json({ success: true, MenuID: menuID, Is_Available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update menu status' });
  }
});

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

export default router;