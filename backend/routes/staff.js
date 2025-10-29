import express from "express";
import { pool } from "../db.js";
import { authenticateJWT } from "../middleware/auth.js";
import bcrypt from "bcrypt";

const router = express.Router();

// -----------------------------
// GET /api/staff
// ดึงพนักงานทั้งหมด
// -----------------------------
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT StaffID, Name, Sur_Name, Role, Phone_Number, Username, Staff_is_available FROM staff");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// -----------------------------
// POST /api/staff
// เพิ่มพนักงานใหม่
// -----------------------------
router.post("/", authenticateJWT, async (req, res) => {
  try {
    const { Name, Sur_Name, Role, Phone_Number, Username, Password } = req.body;
    if (!Name || !Sur_Name || !Role || !Username || !Password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // เช็ค Username ซ้ำ
    const [existing] = await pool.query("SELECT StaffID FROM staff WHERE Username = ?", [Username]);
    if (existing.length > 0) return res.status(400).json({ error: "Username already exists" });

    const hashedPassword = await bcrypt.hash(Password, 10);

    const [result] = await pool.query(
      "INSERT INTO staff (Name, Sur_Name, Role, Phone_Number, Username, Password) VALUES (?, ?, ?, ?, ?, ?)",
      [Name, Sur_Name, Role, Phone_Number, Username, hashedPassword]
    );

    res.json({ StaffID: result.insertId, Name, Sur_Name, Role, Phone_Number, Username, Staff_is_available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add staff" });
  }
});

// -----------------------------
// PUT /api/staff/:id
// แก้ไขข้อมูลพนักงาน (Optional)
// -----------------------------
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { Name, Sur_Name, Role, Phone_Number, Password } = req.body;

    const updates = [];
    const values = [];

    if (Name) { updates.push("Name = ?"); values.push(Name); }
    if (Sur_Name) { updates.push("Sur_Name = ?"); values.push(Sur_Name); }
    if (Role) { updates.push("Role = ?"); values.push(Role); }
    if (Phone_Number) { updates.push("Phone_Number = ?"); values.push(Phone_Number); }
    if (Password) {
      const hashedPassword = await bcrypt.hash(Password, 10);
      updates.push("Password = ?");
      values.push(hashedPassword);
    }

    if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });

    values.push(id);
    await pool.query(`UPDATE staff SET ${updates.join(", ")} WHERE StaffID = ?`, values);

    res.json({ message: "Staff updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update staff" });
  }
});

// -----------------------------
// PUT /api/staff/:id/toggle
// เปิด/ปิดใช้งานพนักงาน
// -----------------------------
router.put("/:id/toggle", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { Staff_is_available } = req.body;

    if (typeof Staff_is_available !== "boolean") return res.status(400).json({ error: "Staff_is_available must be boolean" });

    await pool.query("UPDATE staff SET Staff_is_available = ? WHERE StaffID = ?", [Staff_is_available, id]);
    res.json({ message: "Staff availability updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to toggle staff availability" });
  }
});

export default router;
