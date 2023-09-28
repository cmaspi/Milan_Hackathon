import os
import psycopg2
import psycopg2.extras
import aiosql
from dotenv import load_dotenv
from fastapi import Header, HTTPException
from google.auth import exceptions

from typing import Tuple

from auth import get_user_details
from ML.Summarizer import Summarize

summarizer = Summarize()

load_dotenv()

DATABASE = os.getenv("DATABASE")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASS = os.getenv("POSTGRES_PASS")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

queries = aiosql.from_path("./queries.sql", "psycopg2")

conn = psycopg2.connect(
    database=DATABASE,
    user=POSTGRES_USER,
    password=POSTGRES_PASS,
    host=POSTGRES_HOST,
    port=POSTGRES_PORT,
    cursor_factory=psycopg2.extras.DictCursor,
)
conn.autocommit = True


def map_info_row(row):
    id, title, info = row
    return {"id": id, "movie_title": title, "movie_info": info}


def map_review_row(row):
    movie_id, name, email, review, rating, id = row
    return {
        "id": id,
        "movie_id": movie_id,
        "user_name": name,
        "user_email": email,
        "review": review,
        "rating": rating,
    }

def update_summary(movie_id):
    movie_title = queries.get_movie_title(conn, movie_id=movie_id)
    res = queries.get_movie_reviews(conn, movie_id=movie_id)
    reviews = [row[3] for row in res]

    summary = summarizer.summarize(movie_title, reviews)
    try:
        queries.update_movie_summary(conn, movie_id=movie_id, summary=summary)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    print(summary)
    return summary


def map_movie_row(row):
    id, movie_title, movie_info, release_year, directors, content_rating, genres, tomatometer_rating, summary = row
    if summary is None:
        summary = update_summary(id)
    return {
        "id": id,
        "movie_title": movie_title,
        "movie_info": movie_info,
        "release_year": release_year,
        "directors": directors,
        "content_rating": content_rating,
        "genres": genres,
        "tomatometer_rating": tomatometer_rating,
        "summary": summary
    }


def verify_auth_token(Authorization: str = Header()) -> Tuple[str, str]:
    try:
        details = get_user_details(Authorization)
        if details is None:
            raise HTTPException(
                status_code=401, detail="We are not able to authenticate you."
            )
    except exceptions.InvalidValue:
        raise HTTPException(
            status_code=498, detail="Invalid Token, please login again."
        )
    return details
