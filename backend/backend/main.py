from typing import Literal, Tuple

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from utils import verify_auth_token, conn, queries, map_info_row, map_review_row, map_movie_row, update_summary

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
    res = queries.get_movie_names(conn)
    def map_row(row):
        id, title = row
        return {"id": id, "title": title}
    res = list(map(map_row, res))
    return res


@app.get("/search")
def search_movies(q: str):
    res = queries.search_movies_by_title(conn, q=q)
    res = list(map(map_info_row, res))
    return res


@app.get("/movies")
def get_movies(sort: Literal["title", "year", "rating"] = "title", order: Literal["asc", "desc", "default"] = "default", page: int = 1):
    PAGE_SIZE = 100 
    query_fn = None
    if order == "default":
        if sort == "title":
            order = "asc"
        else:
            order = "desc"
    query_fn = getattr(queries, f"get_movies_sort_{sort}_{order}")
    limit = PAGE_SIZE
    offset = (page - 1) * PAGE_SIZE

    res = query_fn(conn, limit=limit, offset=offset)
    res = list(map(map_info_row, res))
    return res


@app.get("/movies/{movie_id}")
def get_movie(movie_id: str):
    res = queries.get_movie_by_id(conn, movie_id=movie_id)
    if res is None:
        raise HTTPException(status_code=404, detail="Movie not found.")
    # TODO: make sure summary is not null
    res = map_movie_row(res)
    return res


app.mount("/posters", StaticFiles(directory="posters/"), name="posters")


@app.get("/movies/{movie_id}/reviews")
def get_reviews(movie_id: str):
    res = queries.get_movie_reviews(conn, movie_id=movie_id)
    res = list(map(map_review_row, res))
    return res


@app.post("/movies/{movie_id}/reviews")
def create_review(movie_id: str, review: str, rating: str | None = None, details: Tuple[str, str] = Depends(verify_auth_token)):
    email, name = details
    try:
        queries.insert_movie_review(conn, movie_id=movie_id, name=name, email=email, review=review, rating=rating)
        update_summary(movie_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/movies/{movie_id}/reviews/{review_id}")
def delete_review(movie_id: str, review_id: int, details: Tuple[str, str] = Depends(verify_auth_token)):
    email, _ = details

    owner_email = queries.get_review_email(conn, movie_id=movie_id, review_id=review_id)
    if owner_email is not None and owner_email != email:
        raise HTTPException(status_code=403, detail="You are not allowed to delete this review.")

    cnt = queries.delete_movie_review(conn, movie_id=movie_id, review_id=review_id, user_email=email)
    if cnt == 1:
        try:
            update_summary(movie_id)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        return {"message": "Review deleted successfully."}
    else:
        raise HTTPException(status_code=404, detail="Review not found.")
