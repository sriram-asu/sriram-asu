import heapq
import json
import pymongo
import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')
nltk.download('stopwords')
from nltk.tokenize import word_tokenize, sent_tokenize
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import random
from bson.objectid import ObjectId
import numpy as np
from nltk.corpus import stopwords
from collections import Counter
from nltk import word_tokenize
from nltk.util import ngrams
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords

def calculate_t8(selected_task, number_of_words, ins):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    k_closest = database["k_closest"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]
    # selected_task = '619c81f341f91ace9bf5cf06'
    documents = k_closest.find({ 'task_id' : selected_task },{ 'task_id': 1,'neighbours' : 1})
    neighbours = []
    for document in documents:
        for n in document['neighbours']:
            keys = list(n.keys())
            neighbours.append(keys[0])
    neighbours.append(selected_task)
    result_dict = {}
    for task_id in neighbours:
        task_definition = embeddings.find({ '_id': ObjectId(task_id) },{"definition":1})
        instances = testcol.find({ 'Definition': task_definition[0]['definition'] },{"Instances":1})
        tokenized_sentences = []
        number_of_samples = min(20, len(instances[0]['Instances']))
        for i in range(number_of_samples):
            for w in word_tokenize(instances[0]['Instances'][i]['input'].lower()):
                tokenized_sentences.append(w)
        if(task_id == selected_task and ins != ''):
            for w in word_tokenize(ins.lower()):
                tokenized_sentences.append(w)
            number_of_samples = number_of_samples + 1
        tokens = [t for t in tokenized_sentences if t not in set(stopwords.words('english'))]
        word_l = WordNetLemmatizer()
        tokens = [word_l.lemmatize(t) for t in tokens if t.isalpha()]
        n_grams = list(ngrams(tokens, number_of_words))
        counter = Counter(n_grams)
        res = counter.most_common(100)
        word_counts = []
        for pair in res:
            word_counts.append(pair[1])
        result_dict[task_id] = np.std(word_counts)
    return result_dict