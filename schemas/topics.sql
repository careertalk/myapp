DROP TABLE IF EXISTS Users;

CREATE TABLE IF NOT EXISTS Topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- Topicsテーブルにデータを追加
INSERT INTO Topics (name, description) VALUES
  ('プログラミング', 'プログラミングに関する話題'),
  ('Web開発', 'Web開発に関する話題'),
  ('データサイエンス', 'データ解析や機械学習に関する話題');