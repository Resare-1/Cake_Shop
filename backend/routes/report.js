import express from "express";
import { pool } from "../db.js";
import { authenticateJWT } from "../middleware/auth.js";
import { Parser } from "json2csv";

const router = express.Router();

// GET /api/report/sales
router.get("/sales", authenticateJWT, async (req, res) => {
  try {
    // 1️⃣ ดึง order รายละเอียดทั้งหมด
    const [orderDetails] = await pool.query(`
      SELECT 
        o.Order_id AS OrderID,
        o.Order_date AS OrderDate,
        s.Name AS StaffName,
        m.MenuName,
        oi.Quantity,
        oi.Subtotal,
        (SELECT SUM(oi2.Subtotal) 
         FROM order_item oi2 
         WHERE oi2.Order_id = o.Order_id) AS OrderTotal
      FROM order_item oi
      JOIN menu m ON oi.MenuID = m.MenuID
      JOIN \`order\` o ON oi.Order_id = o.Order_id
      JOIN staff s ON o.StaffID = s.StaffID
      WHERE o.Order_Status = 'Complete'
      ORDER BY o.Order_date ASC, o.Order_id ASC
    `);

    // 2️⃣ สรุปยอดขายต่อเมนูต่อเดือน
    const [menuSummary] = await pool.query(`
      SELECT 
        DATE_FORMAT(o.Order_date, '%Y-%m') AS Month,
        m.MenuName,
        SUM(oi.Quantity) AS TotalQuantity,
        SUM(oi.Subtotal) AS TotalRevenue
      FROM order_item oi
      JOIN menu m ON oi.MenuID = m.MenuID
      JOIN \`order\` o ON oi.Order_id = o.Order_id
      WHERE o.Order_Status = 'Complete'
      GROUP BY Month, m.MenuID, m.MenuName
      ORDER BY Month ASC, TotalQuantity DESC
    `);

    // 3️⃣ สรุปยอดขายรวมต่อเดือน
    const [monthSummary] = await pool.query(`
      SELECT 
        DATE_FORMAT(Order_date, '%Y-%m') AS Month,
        SUM(oi.Subtotal) AS TotalRevenue
      FROM order_item oi
      JOIN \`order\` o ON oi.Order_id = o.Order_id
      WHERE o.Order_Status = 'Complete'
      GROUP BY Month
      ORDER BY Month ASC
    `);

    // รวมข้อมูลเป็น JSON เพื่อแปลงเป็น CSV
    let csvRows = [];

    // Section 1
    csvRows.push({ Section: "Order Details" });
    orderDetails.forEach(r => {
      csvRows.push({
        OrderID: r.OrderID,
        OrderDate: r.OrderDate,
        StaffName: r.StaffName,
        MenuName: r.MenuName,
        Quantity: r.Quantity,
        Subtotal: r.Subtotal,
        OrderTotal: r.OrderTotal
      });
    });

    // Section 2
    csvRows.push({});
    csvRows.push({ Section: "Menu Summary per Month" });
    menuSummary.forEach(r => {
      csvRows.push({
        Month: r.Month,
        MenuName: r.MenuName,
        TotalQuantity: r.TotalQuantity,
        TotalRevenue: r.TotalRevenue
      });
    });

    // Section 3
    csvRows.push({});
    csvRows.push({ Section: "Monthly Total Revenue" });
    monthSummary.forEach(r => {
      csvRows.push({
        Month: r.Month,
        TotalRevenue: r.TotalRevenue
      });
    });

    const fields = [
      "Section",
      "OrderID",
      "OrderDate",
      "StaffName",
      "MenuName",
      "Quantity",
      "Subtotal",
      "OrderTotal",
      "Month",
      "TotalQuantity",
      "TotalRevenue"
    ];

    const parser = new Parser({ fields, header: true });
    const csv = parser.parse(csvRows);

    res.header("Content-Type", "text/csv");
    res.attachment("sales_report.csv");
    res.send(csv);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate CSV" });
  }
});

export default router;
