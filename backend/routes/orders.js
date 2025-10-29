// backend/routes/order.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();


// GET /api/orders/:id/details
router.get('/:id/details', async (req, res) => {
  try {
    const sql = `
      SELECT 
        m.MenuName,
        oi.Quantity,
        m.MenuPrice,
        oi.Subtotal,
        o.Note
      FROM order_item oi
      JOIN menu m ON oi.MenuID = m.MenuID
      JOIN \`order\` o ON o.Order_id = oi.Order_id
      WHERE oi.Order_id = ?;
    `;
    const [rows] = await pool.query(sql, [req.params.id]);
    res.json(rows);
  } catch (err) {
    console.error('DB ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/start
router.put('/:id/start', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const staffId = req.body.StaffID; // ส่งมาจาก frontend

    await conn.beginTransaction();

    // 1) เปลี่ยนสถานะ order
    await conn.query(
      `UPDATE \`order\` SET Order_Status='Processing' WHERE Order_id=?`,
      [req.params.id]
    );

    // 2) ดึงเมนูใน order
    const [items] = await conn.query(
      `SELECT MenuID, Quantity FROM order_item WHERE Order_id=?`,
      [req.params.id]
    );

    // 3) หักสต็อกวัตถุดิบ
    for (const item of items) {
      const [ingredients] = await conn.query(
        `SELECT IngredientID, qty_required FROM menu_ingredient WHERE MenuID=?`,
        [item.MenuID]
      );
      for (const ing of ingredients) {
        const totalUse = ing.qty_required * item.Quantity;
        await conn.query(
          `UPDATE ingredient SET Stock_qty = Stock_qty - ? WHERE IngredientID=?`,
          [totalUse, ing.IngredientID]
        );
      }
    }

    // 4) เพิ่มบันทึก production
    await conn.query(
      `INSERT INTO production (StaffID, Order_id, Production_Date)
       VALUES (?, ?, NOW())`,
      [staffId, req.params.id]
    );

    await conn.commit();
    res.json({ message: 'Order started successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('DB ERROR:', err);
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

// GET /api/orders/pending
router.get('/pending', async (req, res) => {
  try {
    const sql = `
        SELECT 
    o.Order_id,
    o.Order_Status,
    s.Name AS StaffName,
    o.Order_date,
    o.Order_deadline,
    SUM(oi.Subtotal) AS TotalAmount
  FROM \`order\` o
  JOIN staff s ON o.StaffID = s.StaffID
  JOIN order_item oi ON o.Order_id = oi.Order_id
  WHERE o.Order_Status = ?
  GROUP BY o.Order_id, o.Order_Status, s.Name, o.Order_date, o.Order_deadline
  ORDER BY o.Order_date DESC;
    `;
    // ใช้ parameter array เพื่อป้องกัน SQL injection
    const [rows] = await pool.query(sql, ['Pending']);
    res.json(rows);
  } catch (err) {
    console.error('DB ERROR:', err); // log error จริง
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/cancelled
router.get('/cancelled', async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.Order_id,
        o.Order_Status,
        o.Note,
        s.Name AS StaffName,
        o.Order_date,
        o.Order_deadline
      FROM \`order\` o
      JOIN staff s ON o.StaffID = s.StaffID
      WHERE o.Order_Status = 'Cancel'
      ORDER BY o.Order_date DESC;
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/restart
router.put('/:id/restart', async (req, res) => {
  try {
    const staffId = req.body.StaffID;

    await pool.query(
      `UPDATE \`order\` SET Order_Status='Processing' WHERE Order_id=?`,
      [req.params.id]
    );

    await pool.query(
      `INSERT INTO production (StaffID, Order_id, Production_Date)
       VALUES (?, ?, NOW())`,
      [staffId, req.params.id]
    );

    res.json({ message: 'Order restarted from Cancel successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/processing
router.get('/processing', async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.Order_id,
        s.Name AS StaffName,
        o.Order_Status,
        o.Note,
        SUM(oi.Subtotal) AS TotalAmount
      FROM \`order\` o
      JOIN staff s ON o.StaffID = s.StaffID
      JOIN order_item oi ON o.Order_id = oi.Order_id
      WHERE o.Order_Status = 'Processing'
      GROUP BY o.Order_id;
    `;
    const [rows] = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/orders/:id/complete
router.put('/:id/complete', async (req, res) => {
  try {
    await pool.query(
      `UPDATE \`order\` SET Order_Status='CheckOrder' WHERE Order_id=?`,
      [req.params.id]
    );
    res.json({ message: 'Order marked as CheckOrder (done)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
