USE CakeShop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(200),
  role ENUM('Admin','Staff','Manager') DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- เปลี่ยนเพื่อให้ เข้าระบบได้เฉยๆ 
INSERT INTO users (username, password, fullname, role)
VALUES ('manager', 'manager123', 'Manager Account', 'Manager');
