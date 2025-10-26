import express from 'express';
import { pool } from '../db.js';
import { Parser } from 'json2csv';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/finance', authenticateJWT, authorizeRole('Manager'), async (req, res) => {
  const [rows] = await pool.query(
    'SELECT OrderID, CustomerName, TotalAmount, PaymentMethod, CreatedAt FROM orders'
  );
  const parser = new Parser({ fields: ['OrderID','CustomerName','TotalAmount','PaymentMethod','CreatedAt'] });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('finance_report.csv');
  res.send(csv);
});

export default router;
