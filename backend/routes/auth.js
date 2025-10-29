import express from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';
import dotenv from 'dotenv';
import bcrypt from "bcrypt";
dotenv.config();

const router = express.Router();

// Login staff
router.post('/login', async (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password)
    return res.status(400).json({ error: 'Username and password are required' });

  try {
    const [rows] = await pool.query(
      'SELECT * FROM staff WHERE Username = ?',
      [username]
    );

    const staff = rows[0];
    if (!staff) return res.status(401).json({ error: 'User not found' });

    // เปรียบเทียบรหัสผ่าน hashed
    const match = await bcrypt.compare(password, staff.Password);
    if (!match) return res.status(401).json({ error: 'Invalid password' });

    const payload = {
      StaffID: staff.StaffID,
      Name: staff.Name,
      role: staff.Role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router