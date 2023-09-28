CREATE TABLE movies (
  -- from db
  id VARCHAR(20) PRIMARY KEY NOT NULL,
  movie_title TEXT NOT NULL DEFAULT '',
  movie_info TEXT NOT NULL DEFAULT '',
  release_year INTEGER,
  directors TEXT NOT NULL DEFAULT '',
  content_rating TEXT NOT NULL DEFAULT '',
  genres TEXT NOT NULL DEFAULT '',
  tomatometer_rating INTEGER NOT NULL DEFAULT 0,

  -- from model/data
  pos_reviews INTEGER NOT NULL DEFAULT 0,
  neu_reviews INTEGER NOT NULL DEFAULT 0,
  neg_reviews INTEGER NOT NULL DEFAULT 0,
  summary TEXT
);

CREATE TYPE SENTIMENT AS ENUM ('pos', 'neu', 'neg');

CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  movie_id VARCHAR(20) NOT NULL REFERENCES movies(id),
  user_name TEXT NOT NULL DEFAULT 'Anonymous',
  user_email TEXT NOT NULL DEFAULT '',
  review TEXT NOT NULL DEFAULT '',
  rating TEXT NOT NULL DEFAULT '',
  sentiment SENTIMENT
);
