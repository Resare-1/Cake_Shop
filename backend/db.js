// backend/db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'cakeshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// ตรวจสอบ connection ทันที
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL Database:", process.env.DB_NAME);
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();
