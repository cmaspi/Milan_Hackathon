import pandas as pd
import numpy as np

df = pd.read_csv('rotten_tomatoes_movies.csv', dtype=str)
df = df.replace(np.nan, '', regex=True)

#extract the columns we want
new_df = df[['rotten_tomatoes_link', 'movie_title', 'movie_info', 'directors', 'content_rating', 'genres', 'tomatometer_rating']]
#extract year from movie release date

def get_year(row):
    if row['original_release_date'] == "":
        if row['streaming_release_date'] == "":
            return ""
        return row['streaming_release_date'][:4]
    return row['original_release_date'][:4]
new_df['release_year'] = df.apply(get_year, axis=1)

# move release_year to index 3
cols = new_df.columns.tolist()
cols = cols[:3] + cols[-1:] + cols[3:-1]
new_df = new_df[cols]

new_df['summary'] = ""


#rename columns
new_df = new_df.rename(columns={'rotten_tomatoes_link': 'id'})
new_df.to_csv('movies.csv', index=False)

df1 = pd.read_csv('rotten_tomatoes_critic_reviews.csv')
df1 = df1.replace(np.nan, '', regex=True)
#extract the columns we want
new_df1 = df1[['rotten_tomatoes_link', 'critic_name', 'review_content', 'review_score']]
#rename columns
new_df1 = new_df1.rename(columns={'rotten_tomatoes_link': 'movie_id', 'critic_name': 'user_name', 'review_content': 'review', 'review_score': 'rating'})
# add empty columns
new_df1['user_email'] = ""
# move user_email to index 2
cols = new_df1.columns.tolist()
cols = cols[:2] + cols[-1:] + cols[2:-1]
new_df1 = new_df1[cols]
new_df1.to_csv('reviews.csv', index=False)
