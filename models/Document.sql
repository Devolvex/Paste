CREATE TABLE pastes (
  id VARCHAR(255) NOT NULL,
  value VARCHAR(99999) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);