import matplotlib.pyplot as plt
from sentence_transformers import SentenceTransformer
from transformers import AutoModelForSequenceClassification
from transformers import TFAutoModelForSequenceClassification
from transformers import AutoTokenizer, AutoConfig
import numpy as np
from scipy.special import softmax

def histogram(ratings):
    num_bins = 5

    plt.hist(ratings, bins=num_bins, alpha=0.7)
    plt.grid()
    plt.xlabel('-')
    plt.ylabel('Frequency')
    plt.title('Histogram Example')

    plt.show()

def func(n):
    if n==0:
        return 'NEG'
    if n==1:
        return 'NEU'
    if n==2:
        return 'POS'
    
def sentiment_analysis(reviews: List[str]) -> List[str]:
    """
    Summary
    ---
    Classifies each of the reviews as one of the following
    0:Negative
    1:Neutral
    2:Positive
    Input
    ----
    reviews List[str]: List of reviews

    Returns
    ---
    List[str]: List of sentiment of each of the reviews.
    """
    tokenizer = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")
    model = AutoModelForSequenceClassification.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")

    review_sentiment=[]
    i=0
    for  review in reviews:
        if i==10:
            break
        encoded_input = tokenizer(review, return_tensors='pt')
        output = model(**encoded_input)
        scores = output[0][0].detach().numpy()
        scores = softmax(scores)
        """ 
        0:Negative
        1:Neutral
        2:Positive
        """
        indx=np.argmax(scores)
        review_sentiment.append(func(indx))
        return review_sentiment
