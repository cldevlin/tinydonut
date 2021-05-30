DROP TABLE IF EXISTS donuts_categories CASCADE;
CREATE TABLE donuts_categories (
  id SERIAL PRIMARY KEY NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  donut_id INTEGER REFERENCES donuts(id) ON DELETE CASCADE
);
