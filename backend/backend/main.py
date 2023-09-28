from typing import Literal, Optional, Tuple

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from utils import verify_auth_token, conn, queries

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/names")
def get_movie_names():
    return queries.get_movie_names(conn)


@app.get("/search")
def search_movies(q: str):
    return queries.search_movies_by_title(conn, q=q)


@app.get("/movies")
def get_movies(sort: Literal["title", "year", "rating"] = "title", order: Literal["asc", "desc"] | None = None, page: int = 1):
    PAGE_SIZE = 20
    query_fn = None
    if order is None:
        if sort == "title":
            order = "asc"
        else:
            order = "desc"
    query_fn = getattr(queries, f"get_movies_sort_{sort}_{order}")
    limit = PAGE_SIZE
    offset = (page - 1) * PAGE_SIZE
    return query_fn(conn, limit=limit, offset=offset)


@app.get("/movies/{movie_id}")
def get_movie(movie_id: str):
    # TODO: make sure summary is not null
    return queries.get_movie_by_id(conn, movie_id=movie_id)


@app.get("/movies/{movie_id}/reviews")
def get_reviews(movie_id: str):
    # TODO: make sure sentiment is not null
    return queries.get_movie_reviews(conn, movie_id=movie_id)


@app.post("/movies/{movie_id}/reviews")
def create_review(movie_id: str, review: str, rating: str | None = None, details: Tuple[str, str] = Depends(verify_auth_token)):
    email, name = details
    # TODO: find sentiment
    # TODO: update senti counts in movies table
    sentiment = None
    # queries.post_movie_review(conn, movie_id, name, email, review, rating, sentiment)
    queries.post_movie_review(conn, movie_id=movie_id, name=name, email=email, review=review, rating=rating, sentiment=sentiment)


@app.delete("/movies/{movie_id}/reviews/{review_id}")
def delete_review(movie_id: str, review_id: int, details: Tuple[str, str] = Depends(verify_auth_token)):
    email, _ = details

    owner_email = queries.get_review_email(conn, movie_id, review_id)
    if owner_email is not None and owner_email != email:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this review.")

    cnt = queries.delete_movie_review(conn, movie_id, review_id, email)
    if cnt == 1:
        return {"message": "Review deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Review not found.")
