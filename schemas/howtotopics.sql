DROP TABLE IF EXISTS HowtoTopics;
CREATE TABLE IF NOT EXISTS  HowtoTopics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  howto_id INT NOT NULL,
  topic_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (blog_id) REFERENCES Blogs(id) ON DELETE CASCADE,
  FOREIGN KEY (topic_id) REFERENCES Topics(id) ON DELETE CASCADE
);


INSERT INTO HowtoTopics (howto_id, topic_id) VALUES
  (1, 1), -- '初めてのブログ投稿' は 'プログラミング' トピックに関連付け
  (2, 2), -- 'Web開発のヒント' は 'Web開発' トピックに関連付け
  (3, 3); -- 'データサイエンス入門' は 'データサイエンス' トピックに関連付け