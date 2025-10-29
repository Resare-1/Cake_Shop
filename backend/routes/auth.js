// backend/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Login staff
router.post('/login', async (req, res) => {
  // trim input to avoid accidental spaces
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  console.log('Login attempt:', { username, password });

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM staff WHERE Name = ?',
      [username]
    );

    const staff = rows[0];
    if (!staff) {
      console.log('User not found in DB:', username);
      return res.status(401).json({ error: 'User not found' });
    }

    console.log('DB password:', staff.Password);

    // check password (plain text)
    if (staff.Password.trim() !== password) {
      console.log('Invalid password:', password, '!=', staff.Password);
      return res.status(401).json({ error: 'Invalid password' });
    }

    // JWT payload
    const payload = {
      StaffID: staff.StaffID,
      Name: staff.Name,
      role: staff.Role
    };

    // sign token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    console.log('Login successful:', payload);

    res.json({ token, user: payload });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
