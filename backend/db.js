// backend/db.js
import mysql from "mysql2/promise"; // ต้องเป็น promise
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
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
