# Setting up the backend

# Create the virtual environment,

```
python3 -m pip install poetry
poetry install # this will create the venv and install the dependencies
poetry shell # activate the venv
```

## Download the dataset

Download this dataset: https://www.kaggle.com/datasets/stefanoleone992/rotten-tomatoes-movies-and-critic-reviews-dataset

Unzip it and place the CSV files in the `init_db` folder.

## Set up the database

Create a postgresql database (suppose it is called `movie_review`), then run the following commands:

```
cd init_db
python3 01-init_db.py
psql movie_reviews -f 02-init_db.sql
```

## Download the model

Download the `model` folder from [here](https://drive.google.com/drive/folders/1zUWndHC9Qr0BHXbr24QCMEL8uhLxoMSQ?usp=sharing) and move it to `./backend/ML/model/`.

## Download static files (posters)

From the [previous link](https://drive.google.com/drive/folders/1zUWndHC9Qr0BHXbr24QCMEL8uhLxoMSQ?usp=sharing),
download the `posters.zip` file. Place the unzipped `posters` folder in `./backend/posters`.

## Run the backend

Once all of the setup is done, run the backend with the following commands (make sure you are in the `backend/backend` folder):

```
poetry shell # activate the venv
uvicorn main:app
```

The backend should be running on `http://localhost:8000`.
