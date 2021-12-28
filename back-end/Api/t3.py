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

def calculate_t3(selected_task, ins):
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
            tokenized_sentences.append(word_tokenize(instances[0]['Instances'][i]['input'].lower()))
        if(task_id == selected_task and ins != ''):
            tokenized_sentences.append(word_tokenize(ins.lower()))
            number_of_samples = number_of_samples + 1
        tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(tokenized_sentences)]
        model = Doc2Vec(tagged_data, vector_size = 4, window = 2, min_count = 1)
        word_counts = []
        for word in model.wv.key_to_index.keys():
            word_counts.append(model.wv.get_vecattr(word, "count"))
        result_dict[task_id] = np.std(word_counts)
    return result_dict

def calculate_t4(selected_task, pos_type, ins):
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
        sentences = []
        for i in range(number_of_samples):
            sentences.append(instances[0]['Instances'][i]['input'].lower())
        if(task_id == selected_task and ins != ''):
            sentences.append(ins.lower())
            number_of_samples = number_of_samples + 1
        tagged = []
        for i in sentences:
            wordsList = nltk.word_tokenize(i)
            wordsList = [w for w in wordsList if not w in set(stopwords.words('english'))]
            tagged.append(nltk.pos_tag(wordsList))
        count = {}
        for tag_line in tagged:
            for tag in tag_line:
                if tag[0] in count:
                    count[tag[0]] = count[tag[0]] + 1
                else:
                    count[tag[0]] = 0
        word_freq = []
        for tag_line in tagged:
            for tag in tag_line:
                if tag[1] in pos_type:
                    word_freq.append(count[tag[0]])
        result_dict[task_id] = np.std(word_freq)
    return result_dict