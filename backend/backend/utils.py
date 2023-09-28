import os
import psycopg2
import psycopg2.extras
import aiosql
from dotenv import load_dotenv
from auth import get_user_details
from fastapi import Header, HTTPException
from google.auth import exceptions

from typing import Tuple

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
