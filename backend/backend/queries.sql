-- name: get_movie_names
-- Get all movie names and their ids
SELECT id, movie_title FROM movies;

-- name: search_movies_by_title
SELECT id, movie_title, movie_info FROM movies WHERE movie_title ILIKE '%%' || :q || '%%';


-- name: get_movies_sort_rating_desc
SELECT id, movie_title, movie_info FROM movies ORDER BY tomatometer_rating DESC LIMIT :limit OFFSET :offset;

-- name: get_movies_sort_rating_asc
SELECT id, movie_title, movie_info FROM movies ORDER BY tomatometer_rating ASC LIMIT :limit OFFSET :offset;

-- name: get_movies_sort_year_desc
SELECT id, movie_title, movie_info FROM movies ORDER BY release_year DESC LIMIT :limit OFFSET :offset;

-- name: get_movies_sort_year_asc
SELECT id, movie_title, movie_info FROM movies ORDER BY release_year ASC LIMIT :limit OFFSET :offset;

-- name: get_movies_sort_title_desc
SELECT id, movie_title, movie_info FROM movies ORDER BY movie_title DESC LIMIT :limit OFFSET :offset;

-- name: get_movies_sort_title_asc
SELECT id, movie_title, movie_info FROM movies ORDER BY movie_title ASC LIMIT :limit OFFSET :offset;


-- name: get_movie_by_id
SELECT * FROM movies WHERE id = :movie_id;

-- name: get_movie_reviews
SELECT * FROM reviews WHERE movie_id = :movie_id;

-- name: insert_movie_review
INSERT INTO reviews (movie_id, user_name, user_email, review, rating, sentiment) VALUES (:movie_id, :name, :email, :review, :rating, :sentiment);

-- name: get_review_email$
SELECT user_email FROM reviews WHERE movie_id = :movie_id AND review_id = :review_id;

-- name: delete_movie_review!
DELETE FROM reviews WHERE movie_id = :movie_id AND review_id = :review_id AND user_email = :user_email;

-- name: get_movie_reviews_by_sentiment
SELECT * FROM reviews WHERE movie_id = :movie_id AND sentiment = :sentiment;
