// backend/routes/ingredient.js
import express from "express";
import { pool } from "../db.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

// GET /api/ingredients
// return array: [{MenuID, IngredientID, IngredientName, qty_required, Unit}]
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const sql = `
      SELECT mi.MenuID, i.IngredientID, i.IngredientName, i.Unit, mi.qty_required
    FROM menu_ingredient mi
    JOIN ingredient i ON mi.IngredientID = i.IngredientID
    `;
    const [rows] = await pool.query(sql);
    res.json(rows); // จะได้ array ของ ingredient ที่ไม่ซ้ำ
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
});
// GET /api/ingredients/all
router.get("/all", authenticateJWT, async (req, res) => {
  try {
    const sql = `SELECT IngredientID, IngredientName, Stock_qty AS Quantity, Unit FROM ingredient`;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch all ingredients" });
  }
})
;// PUT /api/ingredients/:id
router.put("/:id", authenticateJWT, async (req, res) => {
  const id = req.params.id;
  const { delta } = req.body;

  try {
    await pool.query(
      "UPDATE ingredient SET Stock_qty = Stock_qty + ? WHERE IngredientID = ?",
      [delta, id]
    );
    res.json({ success: true, IngredientID: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// POST /api/ingredients
router.post("/", authenticateJWT, async (req, res) => {
  const { name, unit, quantity } = req.body;

  if (!name || !unit) {
    return res.status(400).json({ error: "Name and unit are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO ingredient (IngredientName, Unit, Stock_qty) VALUES (?, ?, ?)",
      [name, unit, quantity || 0]
    );
    res.json({ success: true, IngredientID: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add ingredient" });
  }
});

export default router;
