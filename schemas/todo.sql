DROP TABLE IF EXISTS todo;

CREATE TABLE IF NOT EXISTS todo (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL
);

-- Usersテーブルにデータを追加
INSERT INTO todo (title) VALUES
  ('おはよう'),
  ('サンプルデータ'),
  ('よろしくお願いします');