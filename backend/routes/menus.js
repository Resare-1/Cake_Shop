// backend/routes/menu.js
import express from 'express';
import { pool } from '../db.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = express.Router();

// GET /api/menus
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM menu');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch menus' });
  }
});

export default router;
