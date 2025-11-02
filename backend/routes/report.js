import express from "express";
import { pool } from "../db.js";
import { authenticateJWT } from "../middleware/auth.js";
import ExcelJS from "exceljs";

const router = express.Router();

router.get("/full-report", authenticateJWT, async (req, res) => {
  try {
    // ======= 1. Ingredient Usage =======
    const [ingredientUsage] = await pool.query(`
      SELECT 
        i.IngredientID,
        i.IngredientName,
        i.Unit,
        COUNT(DISTINCT mi.MenuID) AS TotalMenusUsed,
        SUM(mi.qty_required * oi.Quantity) AS TotalUsedQty
      FROM ingredient i
      JOIN menu_ingredient mi ON i.IngredientID = mi.IngredientID
      JOIN order_item oi ON mi.MenuID = oi.MenuID
      JOIN \`order\` o ON oi.Order_id = o.Order_id
      WHERE o.Order_Status = 'Complete'
      GROUP BY i.IngredientID, i.IngredientName, i.Unit
      ORDER BY TotalUsedQty DESC, TotalMenusUsed DESC
    `);

    // ======= 2. Order Details =======
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

    // ======= 3. Menu Summary per Month =======
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

    // ======= 4. Monthly Total Revenue =======
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

    // ======= 5. Popular Menu =======
    const [popularMenu] = await pool.query(`
      SELECT 
        m.MenuID,
        m.MenuName,
        SUM(oi.Quantity) AS TotalQuantity,
        SUM(oi.Subtotal) AS TotalRevenue
      FROM order_item oi
      JOIN menu m ON oi.MenuID = m.MenuID
      JOIN \`order\` o ON oi.Order_id = o.Order_id
      WHERE o.Order_Status = 'Complete'
      GROUP BY m.MenuID, m.MenuName
      ORDER BY TotalQuantity DESC, TotalRevenue DESC
    `);

    // ======= สร้าง Excel =======
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Full Report");

    const addSection = (title, headers, data, startRow) => {
      let rowIndex = startRow;

      // Section title
      const sectionRow = sheet.getRow(rowIndex++);
      sectionRow.getCell(1).value = title;
      sectionRow.getCell(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4472C4" },
      };
      sectionRow.getCell(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      sheet.mergeCells(`A${rowIndex-1}:${String.fromCharCode(64 + headers.length)}${rowIndex-1}`);

      // Header row
      const headerRow = sheet.getRow(rowIndex++);
      headers.forEach((h, i) => {
        const cell = headerRow.getCell(i + 1);
        cell.value = h;
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC6EFCE" },
        };
        cell.font = { bold: true };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Data rows
      data.forEach(row => {
        const dataRow = sheet.getRow(rowIndex++);
        headers.forEach((h, i) => {
          dataRow.getCell(i + 1).value = row[h] ?? row[h.toLowerCase()] ?? '';
        });
      });

      return rowIndex + 1;
    };

    let currentRow = 1;
    currentRow = addSection("รายงานปริมาณวัตถุดิบที่ใช้จริง",
      ["IngredientID", "IngredientName", "Unit", "TotalMenusUsed", "TotalUsedQty"],
      ingredientUsage, currentRow
    );
    currentRow = addSection("รายงานรายละเอียดคำสั่งซื้อ (Order Details)",
      ["OrderID", "OrderDate", "StaffName", "MenuName", "Quantity", "Subtotal", "OrderTotal"],
      orderDetails, currentRow
    );
    currentRow = addSection("สรุปยอดขายต่อเมนูต่อเดือน",
      ["Month", "MenuName", "TotalQuantity", "TotalRevenue"],
      menuSummary, currentRow
    );
    currentRow = addSection("สรุปยอดขายรวมต่อเดือน",
      ["Month", "TotalRevenue"],
      monthSummary, currentRow
    );
    currentRow = addSection("เมนูยอดนิยม",
      ["MenuID", "MenuName", "TotalQuantity", "TotalRevenue"],
      popularMenu, currentRow
    );

    // auto-fit columns
    sheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const value = cell.value ? cell.value.toString() : '';
        maxLength = Math.max(maxLength, value.length);
      });
      column.width = maxLength + 2;
    });

    // ส่ง Excel
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=full_report.xlsx");
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
});

export default router;
