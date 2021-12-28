from bson.objectid import ObjectId
import random
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from nltk.tokenize import word_tokenize, sent_tokenize
import heapq
import json
import pymongo
import nltk
import pandas as pd
import csv

import numpy as np
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')


def calculate_chord(selected_task):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    k_closest = database["k_closest"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]
#     selected_task = '619f0947d86dd355fbfbcffa'
    documents = k_closest.find({'task_id': selected_task}, {
                               'task_id': 1, 'neighbours': 1})
    neighbours = []
    for document in documents:
        for n in document['neighbours']:
            keys = list(n.keys())
            neighbours.append(keys[0])
    # result_dict = {}
    definitions = []
    for task_id in neighbours:
        task_definition = embeddings.find(
            {'_id': ObjectId(task_id)}, {"definition": 1})
        # print(task_definition[0])
        # definitions['task_id'] = task_definition
        definitions.append(task_definition[0]['definition'])

# import spacy
# pip install spacy-transformers
# python -m spacy download en_core_web_trf
# nlp = spacy.load('en_core_web_trf')
# data_df = pd.read_excel('data.xlsx')

    def_df = pd.DataFrame(definitions)
    def_df.dropna(subset=[0], inplace=True)
    def_df.reset_index(inplace=True)
    def_df = def_df.drop('index', 1)

    stop_words = set(stopwords.words('english'))
    def_df['words'] = def_df[0].apply(lambda x: ' '.join(
        [word for word in x.split() if word not in (stop_words)]))
    def_df['token'] = def_df['words'].str.replace("'", "")
    def_df['token'] = def_df['token'].str.replace(".", "")
    def_df['token'] = def_df['token'].str.replace(",", "")

    w_tokenizer = nltk.tokenize.WhitespaceTokenizer()
    lemmatizer = nltk.stem.WordNetLemmatizer()

    def lemmatize_text(text):
        return [lemmatizer.lemmatize(w) for w in w_tokenizer.tokenize(text)]
    def_df['text_lemmatized'] = def_df.token.apply(lemmatize_text)

    sentence = def_df['text_lemmatized']
    dicts = {}
    for x in range(len(sentence)):
        arr = []
        for y in range(len(sentence)):
            #         if x!=y:
            l1 = []
            l2 = []
            X_set = set(sentence[x])
            Y_set = set(sentence[y])
            lengthx = len(X_set)
            lengthy = len(Y_set)
            rvector = X_set.union(Y_set)
            for w in rvector:
                if w in X_set:
                    l1.append(1)  # create a vector
                else:
                    l1.append(0)
                if w in Y_set:
                    l2.append(1)
                else:
                    l2.append(0)
            c = 0
            for i in range(len(rvector)):
                c += l1[i]*l2[i]
            cosine = round(c / float((sum(l1)*sum(l2))**0.5), 2)
            arr.append(cosine)
            #print("similarity between {} and {} is {}: ".format(x,y,cosine))
        dicts[neighbours[x]] = arr

        # arr = []

        # for keys, values in dicts.items():
        #     arr.append(values)
    return dicts
