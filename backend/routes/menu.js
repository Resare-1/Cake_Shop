// backend/routes/menu.js
import express from 'express';
import { pool } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu');
    res.json(rows);
  } catch (err) {
    console.error('DB ERROR:', err); // log ชัดเจน
    res.status(500).json({ error: 'Database query failed' });
  }
});

export default router;
