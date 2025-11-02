// backend/routes/menu.js
import express from "express";
import { pool } from "../db.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();


// ================================
// 🔹 GET: ดึงเมนูทั้งหมด
// ================================
router.get("/", authenticateJWT, async (req, res) => {
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
          Ingredients: [],
        };
        menus.push(menuMap[row.MenuID]);
      }

      if (row.IngredientID) {
        menuMap[row.MenuID].Ingredients.push({
          IngredientID: row.IngredientID,
          IngredientName: row.IngredientName,
          qty_required: row.qty_required,
          Unit: row.Unit,
        });
      }
    }

    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menus" });
  }
});


// ================================
// 🔹 POST: เพิ่มเมนูใหม่
// ================================
router.post("/", authenticateJWT, async (req, res) => {
  const { MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom, Ingredients } = req.body;
  if (!MenuName || !MenuPrice || !MenuDescription || !Bake_Time || !Ingredients?.length) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [menuResult] = await pool.query(
      "INSERT INTO menu (MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom, Is_Available) VALUES (?, ?, ?, ?, ?, true)",
      [MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom]
    );

    const menuID = menuResult.insertId;
    const ingredientValues = Ingredients.map((i) => [menuID, i.IngredientID, i.qty_required]);

    if (ingredientValues.length > 0) {
      await pool.query(
        "INSERT INTO menu_ingredient (MenuID, IngredientID, qty_required) VALUES ?",
        [ingredientValues]
      );
    }

    res.json({ MenuID: menuID });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add menu" });
  }
});


// ================================
// 🔹 PUT: แก้ไขเมนู (ชื่อ, ราคา, คำอธิบาย, ฯลฯ)
// ================================
router.put("/:id", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  const { MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom } = req.body;

  try {
    await pool.query(
      `UPDATE menu 
       SET MenuName = ?, MenuPrice = ?, MenuDescription = ?, Bake_Time = ?, Is_Custom = ?
       WHERE MenuID = ?`,
      [MenuName, MenuPrice, MenuDescription, Bake_Time, Is_Custom, menuID]
    );

    res.json({ success: true, message: "Menu updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu" });
  }
});


// ================================
// 🔹 PUT: แก้ไขวัตถุดิบในเมนู (เพิ่ม / ลบ / ปรับจำนวน)
// ================================
router.put("/:id/ingredients", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  const { Ingredients } = req.body; // [{IngredientID, qty_required}]

  if (!Ingredients || !Array.isArray(Ingredients)) {
    return res.status(400).json({ error: "Ingredients must be an array" });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // ลบของเดิมก่อน
    await connection.query("DELETE FROM menu_ingredient WHERE MenuID = ?", [menuID]);

    // เพิ่มของใหม่เข้าไป
    if (Ingredients.length > 0) {
      const values = Ingredients.map((i) => [menuID, i.IngredientID, i.qty_required]);
      await connection.query(
        "INSERT INTO menu_ingredient (MenuID, IngredientID, qty_required) VALUES ?",
        [values]
      );
    }

    await connection.commit();
    res.json({ success: true, message: "Ingredients updated successfully." });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to update menu ingredients" });
  } finally {
    connection.release();
  }
});


// ================================
// 🔹 PUT: Toggle สถานะ Available
// ================================
router.put("/:id/toggle", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  const { Is_Available } = req.body;

  try {
    await pool.query("UPDATE menu SET Is_Available = ? WHERE MenuID = ?", [Is_Available, menuID]);
    res.json({ success: true, MenuID: menuID, Is_Available });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update menu status" });
  }
});


// ================================
// 🔹 DELETE: ลบเมนู + ลบวัตถุดิบที่เกี่ยวข้อง
// ================================
router.delete("/:id", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query("DELETE FROM menu_ingredient WHERE MenuID = ?", [menuID]);
    await connection.query("DELETE FROM menu WHERE MenuID = ?", [menuID]);

    await connection.commit();
    res.json({ success: true, message: "Menu deleted successfully." });
  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to delete menu" });
  } finally {
    connection.release();
  }
});

// ================================
// 🔹 GET: ดึงข้อมูลเมนูตาม ID
// ================================
router.get("/:id", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        m.MenuID, m.MenuName, m.MenuPrice, m.MenuDescription, m.Bake_Time, 
        m.Is_Custom, m.Is_Available,
        i.IngredientID, i.IngredientName, i.Unit, mi.qty_required
      FROM menu m
      LEFT JOIN menu_ingredient mi ON m.MenuID = mi.MenuID
      LEFT JOIN ingredient i ON mi.IngredientID = i.IngredientID
      WHERE m.MenuID = ?
      `,
      [menuID]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Menu not found" });

    const menu = {
      MenuID: rows[0].MenuID,
      MenuName: rows[0].MenuName,
      MenuPrice: rows[0].MenuPrice,
      MenuDescription: rows[0].MenuDescription,
      Bake_Time: rows[0].Bake_Time,
      Is_Custom: rows[0].Is_Custom,
      Is_Available: rows[0].Is_Available,
      Ingredients: rows
        .filter(r => r.IngredientID)
        .map(r => ({
          IngredientID: r.IngredientID,
          IngredientName: r.IngredientName,
          qty_required: r.qty_required,
          Unit: r.Unit,
        })),
    };

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu by ID" });
  }
});
// ================================
// 🔹 GET: ดึงข้อมูลเมนูตาม ID
// ================================
router.get("/:id", authenticateJWT, async (req, res) => {
  const menuID = req.params.id;
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        m.MenuID, m.MenuName, m.MenuPrice, m.MenuDescription, m.Bake_Time, 
        m.Is_Custom, m.Is_Available,
        i.IngredientID, i.IngredientName, i.Unit, mi.qty_required
      FROM menu m
      LEFT JOIN menu_ingredient mi ON m.MenuID = mi.MenuID
      LEFT JOIN ingredient i ON mi.IngredientID = i.IngredientID
      WHERE m.MenuID = ?
      `,
      [menuID]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Menu not found" });

    const menu = {
      MenuID: rows[0].MenuID,
      MenuName: rows[0].MenuName,
      MenuPrice: rows[0].MenuPrice,
      MenuDescription: rows[0].MenuDescription,
      Bake_Time: rows[0].Bake_Time,
      Is_Custom: rows[0].Is_Custom,
      Is_Available: rows[0].Is_Available,
      Ingredients: rows
        .filter(r => r.IngredientID)
        .map(r => ({
          IngredientID: r.IngredientID,
          IngredientName: r.IngredientName,
          qty_required: r.qty_required,
          Unit: r.Unit,
        })),
    };

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch menu by ID" });
  }
});

export default router;
