import express from 'express';
import { pool } from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const { status } = req.query;
    let sql = `
      SELECT 
        o.Order_id,
        o.StaffID,
        o.Order_Status,
        o.Note,
        o.Order_date,
        m.MenuID,
        m.MenuName,
        m.MenuPrice,
        oi.Quantity,
        (oi.Quantity * m.MenuPrice) AS Subtotal
      FROM \`Order\` o
      LEFT JOIN Order_Item oi ON o.Order_id = oi.Order_id
      LEFT JOIN Menu m ON oi.MenuID = m.MenuID
    `;

    const params = [];
    if (status) {
      sql += ' WHERE o.Order_Status = ?';
      params.push(status);
    }

    sql += ' ORDER BY o.Order_id DESC';

    const [rows] = await pool.query(sql, params);

    const ordersMap = {};
    rows.forEach((row) => {
      if (!ordersMap[row.Order_id]) {
        ordersMap[row.Order_id] = {
          Order_id: row.Order_id,
          StaffID: row.StaffID,
          Order_Status: row.Order_Status,
          Note: row.Note,
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
          Note: row.Note || 'ไม่มี',
        });
      }
    });

    res.json(Object.values(ordersMap));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /api/orders/:id - อัปเดต status และ optional note
router.put('/:id', authenticateJWT, async (req, res) => {
  const orderId = req.params.id;
  const { Order_Status, Note } = req.body;

  if (!Order_Status) return res.status(400).json({ error: 'Order_Status is required' });

  try {
    let sql = 'UPDATE `Order` SET Order_Status = ?';
    const params = [Order_Status];

    if (Note !== undefined) {
      sql += ', Note = ?';
      params.push(Note);
    }

    sql += ' WHERE Order_id = ?';
    params.push(orderId);

    const [result] = await pool.query(sql, params);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Order not found' });

    res.json({ success: true, Order_id: orderId, Order_Status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;
