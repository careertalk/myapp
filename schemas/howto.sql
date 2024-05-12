
DROP TABLE IF EXISTS Howto;

CREATE TABLE IF NOT EXISTS Howto (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  published_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);


INSERT INTO Howto (user_id, title, content, slug) VALUES
  (1, '初めてのブログ投稿', '私の初めてのブログ投稿です...', 'first-blog-post'),
  (2, 'Web開発のヒント', 'Web開発のヒントをいくつか紹介します...', 'web-dev-tips'),
  (3, 'データサイエンス入門', 'データサイエンスとは、データを分析し...', 'intro-to-data-science');

