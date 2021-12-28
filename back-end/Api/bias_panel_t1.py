import heapq
import json
import pymongo
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import random
from bson.objectid import ObjectId
import numpy as np

def calculate_t1(selected_task, ins):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    k_closest = database["k_closest"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]

#     selected_task = '619c81f241f91ace9bf5ced9'
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
            tokenized_sentences.append(word_tokenize(instances[0]['Instances'][i]['input'].lower()))
        if(task_id == selected_task and ins != ''):
            tokenized_sentences.append(word_tokenize(ins.lower()))
            number_of_samples = number_of_samples + 1
        tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(tokenized_sentences)]
        model = Doc2Vec(tagged_data, vector_size = 4, window = 2, min_count = 1)
        unique_words = len(model.wv.index_to_key)
        result_dict[task_id] = unique_words/number_of_samples

    return result_dict

def calculate_t2(selected_task, ins):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    k_closest = database["k_closest"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]

#     selected_task = '619c81f241f91ace9bf5ced9'
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
            tokenized_sentences.append(len(instances[0]['Instances'][i]['input'].lower()))
        if(task_id == selected_task and ins != ''):
            tokenized_sentences.append(len(ins.lower()))
            number_of_samples = number_of_samples + 1
        result_dict[task_id] = np.std(tokenized_sentences)
    return result_dict