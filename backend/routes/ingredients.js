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

export default router;
