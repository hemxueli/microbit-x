CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  avatar TEXT NOT NULL,
  class_id TEXT,
  FOREIGN KEY (class_id) REFERENCES classes(id)
);
