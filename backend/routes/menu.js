import express from 'express';
import { pool } from '../db.js';
import { authenticateJWT, authorizeRole } from '../middleware/auth.js';
const router = express.Router();

router.get('/', authenticateJWT, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM menu');
  res.json(rows);
});

router.post('/', authenticateJWT, authorizeRole('Manager', 'Admin'), async (req, res) => {
  const { MenuName, MenuPrice, MenuDescription, Is_Available } = req.body;
  await pool.query(
    'INSERT INTO menu (MenuName, MenuPrice, MenuDescription, Is_Available) VALUES (?, ?, ?, ?)',
    [MenuName, MenuPrice, MenuDescription, Is_Available ? 1 : 0]
  );
  res.status(201).json({ message: 'Menu added' });
});

router.put('/:id', authenticateJWT, authorizeRole('Manager', 'Admin'), async (req, res) => {
  const { MenuName, MenuPrice, MenuDescription, Is_Available } = req.body;
  await pool.query(
    'UPDATE menu SET MenuName=?, MenuPrice=?, MenuDescription=?, Is_Available=? WHERE MenuID=?',
    [MenuName, MenuPrice, MenuDescription, Is_Available ? 1 : 0, req.params.id]
  );
  res.json({ message: 'Menu updated' });
});

export default router;
