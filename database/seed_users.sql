USE CakeShop;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(200),
  role ENUM('Admin','Staff','Manager') DEFAULT 'Staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, fullname, role)
VALUES ('manager', '$2b$10$u9hQe8k6HqY2c8kzZg1YaO1q6uWqvV8fF3eYf8L2QJ9D3jHk6eZ9K', 'Manager Account', 'Manager');
