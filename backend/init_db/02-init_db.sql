DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS movies;
DROP TYPE IF EXISTS SENTIMENT;

CREATE TABLE movies (
  -- from db
  id TEXT PRIMARY KEY NOT NULL,
  movie_title TEXT NOT NULL DEFAULT '',
  movie_info TEXT,
  release_year INTEGER,
  directors TEXT,
  content_rating TEXT NOT NULL DEFAULT '',
  genres TEXT,
  tomatometer_rating INTEGER,

  -- from model/data
  summary TEXT
);

CREATE TABLE reviews (
  movie_id TEXT NOT NULL,
  user_name TEXT,
  user_email TEXT,
  review TEXT,
  rating TEXT
);


\copy movies from movies.csv DELIMITER ',' CSV HEADER;
\copy reviews from reviews.csv DELIMITER ',' CSV HEADER;

-- remove 'm/' from movie_id
UPDATE movies SET id = SUBSTRING(id, 3);
UPDATE reviews SET movie_id = SUBSTRING(movie_id, 3);

-- remove nulls
UPDATE movies SET movie_info = '' WHERE movie_info IS NULL;
UPDATE movies SET release_year = 0 WHERE release_year IS NULL;
UPDATE movies SET directors = '' WHERE directors IS NULL;
UPDATE movies SET genres = '' WHERE genres IS NULL;
UPDATE movies SET tomatometer_rating = 0 WHERE tomatometer_rating IS NULL;
UPDATE reviews SET user_name = '' WHERE user_name IS NULL;
UPDATE reviews SET user_email = '' WHERE user_email IS NULL;
UPDATE reviews SET review = '' WHERE review IS NULL;
UPDATE reviews SET rating = '' WHERE rating IS NULL;

-- add not null constraints
ALTER TABLE movies ALTER COLUMN movie_info SET NOT NULL;
ALTER TABLE movies ALTER COLUMN release_year SET NOT NULL;
ALTER TABLE movies ALTER COLUMN directors SET NOT NULL;
ALTER TABLE movies ALTER COLUMN genres SET NOT NULL;
ALTER TABLE movies ALTER COLUMN tomatometer_rating SET NOT NULL;

ALTER TABLE reviews ALTER COLUMN user_name SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN user_email SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN review SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN rating SET NOT NULL;

-- add primary key to reviews
ALTER TABLE reviews ADD COLUMN id SERIAL PRIMARY KEY;

-- add foreign key
DELETE FROM reviews WHERE movie_id NOT IN (SELECT id FROM movies);
ALTER TABLE reviews ADD CONSTRAINT fk_movies FOREIGN KEY (movie_id) REFERENCES movies (id);
