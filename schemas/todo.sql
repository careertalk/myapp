DROP TABLE IF EXISTS todo;

CREATE TABLE IF NOT EXISTS todo (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);

-- Usersテーブルにデータを追加
INSERT INTO todo (id,title) VALUES
  (1,'おはよう'),
  (2,'サンプルデータ'),
  (3,'よろしくお願いします');