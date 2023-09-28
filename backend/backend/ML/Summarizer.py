import torch
import torch.nn as nn

import os
from typing import List
import ML.utils as utils
from ML.model import Condense, Abstract
from transformers import BertTokenizer
import json
import time


class Summarize:
    def __init__(self):
        """
        Initializes and loads the models
        """
        condense_file = './ML/model/condense.model'
        abstract_file = './ML/model/abstract.model'

        tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
        tokenizer.add_special_tokens({'additional_special_tokens': ['<movie>']})
        vocab_size = len(tokenizer)

        print('Initializing models...')
        con_encoder = nn.Embedding(vocab_size, 256)
        con_encoder.requires_grad_(False)

        con_model = Condense(50, 2, 256, 256, vocab_size)
        con_model.requires_grad_(False)

        model = Abstract(vocab_size, 256, 256)
        model.requires_grad_(False)

        print('Loading models...')
        assert os.path.exists(condense_file)
        best_point = torch.load(condense_file, map_location=torch.device('cpu'))
        con_encoder.load_state_dict(best_point['encoder'])
        con_model.load_state_dict(best_point['model'])

        assert os.path.exists(abstract_file)
        best_point = torch.load(abstract_file, map_location=torch.device('cpu'))
        model.load_state_dict(best_point['model'])
 
        self.tokenizer = tokenizer
        self.con_encoder = con_encoder
        self.con_model = con_model
        self.model = model

    def summarize(self, movie_name: str, reviews: List[str]) -> str:
        """
        This method takes the list of reviews to summarize and the movie name
        to generate a brief summary of the reviews

        Args:
            movie_name (str): Name of the movie
            reviews (List[str]): list of the reviews

        Returns:
            str: the summary of the reviews
        """
        x_test = utils.abstract_data(reviews)
        x_batch = [x_test]

        x_batch = [[self.tokenizer.encode(x_rev) for x_rev in x_inst]
                   for x_inst in x_batch]

        (tokens_batch, token_ids_batch,
         aspect_batch, sentiment_batch) = utils.run_condense(x_batch,
                                                             self.tokenizer,
                                                             self.con_encoder,
                                                             self.con_model)

        tokens_batch = utils.pad_vector(tokens_batch, 256)[0]
        token_ids_batch, token_mask_batch = utils.pad_text(token_ids_batch)
        aspect_batch = torch.Tensor(aspect_batch).float()
        sentiment_batch = torch.Tensor(sentiment_batch).float()

        pred_batch = self.model.beam_search(tokens_batch, token_ids_batch,
                                            token_mask_batch, aspect_batch,
                                            sentiment_batch, beam_size=2,
                                            max_len=200)

        pred = pred_batch.cpu().detach().numpy()
        pred = list([int(p) for p in pred if int(p) != 101])
        try:
            pred = pred[:pred.index(102)]
        except Exception as e:
            pass
        pred = self.tokenizer.decode(pred)
        pred = pred.replace('<movie>', movie_name)

        return pred



if __name__ == '__main__':
    f = open('./data/rotten/test.json', 'r')
    data = json.load(f)
    nlp = Summarize()

    reviews = [r[0] for r in data[0]['reviews']]
    print(reviews.__len__())
    start = time.time()
    print(nlp.summarize("xyz", reviews))
    end = time.time()
    print(end-start)
    reviews = [r[0] for r in data[1]['reviews']]
    print(reviews.__len__())
    start = time.time()
    print(nlp.summarize("xyz", reviews))
    end = time.time()
    print(end-start)
