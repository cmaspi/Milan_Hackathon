from bs4 import BeautifulSoup
import pandas as pd
from urllib import request


base_url = "https://www.rottentomatoes.com/m/"


def download_img(id):
    web_url = request.urlopen(base_url+id)
    html_doc = str(web_url.read())
    soup = BeautifulSoup(html_doc, 'html.parser')
    temp = soup.find('div', {'class': 'movie-thumbnail-wrap'})
    list_tags = [tag.name for tag in temp.find_all()]
    tag_name = list_tags[1]
    poster_url = temp.find(tag_name)['src']
    request.urlretrieve(poster_url, filename=f'./posters/{id}.jpg')


df = pd.read_csv('rotten_tomatoes_movies.csv')
links = df['rotten_tomatoes_link']

for id in links:
    id = id[2:]
    try:
        download_img(id)
    except Exception as e:
        print(f'{id}')
