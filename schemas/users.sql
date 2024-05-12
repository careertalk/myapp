DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usersテーブルにデータを追加
INSERT INTO Users (username, email, password) VALUES
  ('山田太郎', 'yamada@example.com', 'password1'),
  ('鈴木花子', 'suzuki@example.com', 'password2'),
  ('佐藤一郎', 'sato@example.com', 'password3');