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
// PUT /api/orders/:id/fix
// อัปเดต note และเปลี่ยน status เป็น 'Cancel' หรือ 'SendForFix'
router.put('/:id/fix', authenticateJWT, async (req, res) => {
  const orderId = req.params.id;
  const { note } = req.body;

  if (!note) return res.status(400).json({ error: 'Note is required' });

  try {
    await pool.query(
      'UPDATE `Order` SET Order_Status = ?, Note = ? WHERE Order_id = ?',
      ['Cancel', note, orderId]
    );
    res.json({ success: true, Order_id: orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});
// PUT /api/orders/:id/confirm
router.put('/:id/confirm', authenticateJWT, async (req, res) => {
  const orderId = req.params.id;

  try {
    const [result] = await pool.query(
      'UPDATE `order` SET `Order_Status` = ? WHERE `Order_id` = ?',
      ['Complete', orderId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ success: true, Order_id: orderId, Order_Status: 'Completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to confirm order' });
  }
});


export default router;
