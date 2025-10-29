// backend/routes/order.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        o.Order_id,
        o.StaffID,
        o.Order_Status,
        o.Order_date,
        m.MenuID,
        m.MenuName,
        m.MenuPrice,
        oi.Quantity,
        (oi.Quantity * m.MenuPrice) AS Subtotal
      FROM \`Order\` o
      LEFT JOIN Order_Item oi ON o.Order_id = oi.Order_id
      LEFT JOIN Menu m ON oi.MenuID = m.MenuID
      ORDER BY o.Order_id DESC
    `);

    // รวมหลายเมนูของ order เดียวเป็น array
    const ordersMap = {};
    rows.forEach(row => {
      if (!ordersMap[row.Order_id]) {
        ordersMap[row.Order_id] = {
          Order_id: row.Order_id,
          StaffID: row.StaffID,
          Order_Status: row.Order_Status,
          Order_date: row.Order_date,
          items: [],
        };
      }
      if (row.MenuID) {
        ordersMap[row.Order_id].items.push({
          MenuID: row.MenuID,
          MenuName: row.MenuName,
          MenuPrice: row.MenuPrice,
          Quantity: row.Quantity,
          Subtotal: row.Subtotal,
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
