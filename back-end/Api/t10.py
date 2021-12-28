import heapq
import json
import pymongo
import random
from bson.objectid import ObjectId
import numpy as np
from nltk.corpus import stopwords
from collections import Counter
from nltk import word_tokenize
from nltk.util import ngrams
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
import heapq
import json
import pymongo
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

def calculate_t10(selected_task, ins):
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]
    # selected_task = '619c81f341f91ace9bf5cf06'
    result_dict = {}
    result_dict2 = {}
    task_definition = embeddings.find({ '_id': ObjectId(selected_task) },{"definition":1,})
    instances = testcol.find({ 'Definition': task_definition[0]['definition'] },{"Instances":1, "Positive Examples":1,"Negative Examples":1 })
    positive_examples = instances[0]['Positive Examples']
    negative_examples = instances[0]['Negative Examples']
    tokenized_positive_sentences = []
    tokenized_negative_sentences = []
    tokenized_instances_sentences = []
    number_of_samples = min(20, len(instances[0]['Instances']))
    instance_mapper = {}
    instance_dict = {}
    for i in range(number_of_samples):
        tokenized_instances_sentences.append(word_tokenize(instances[0]['Instances'][i]['input'].lower()))
        instance_dict['instance_'+str(i)] = []
        instance_mapper['instance_'+str(i)] = instances[0]['Instances'][i]['input'].lower()
    if( ins != ''):
        tokenized_instances_sentences.append(word_tokenize(ins.lower()))
        instance_dict['instance_'+str(number_of_samples)] = []
        instance_mapper['instance_'+str(number_of_samples)] = ins.lower()
        number_of_samples = number_of_samples + 1
    tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(tokenized_instances_sentences)]
    model = Doc2Vec(tagged_data, vector_size = 100, window = 20, min_count = 1)
    for example in positive_examples:
        test_doc = word_tokenize(example['input'].lower())
        test_doc_vector = model.infer_vector(test_doc)
        for index, similarity in model.dv.most_similar(positive = [test_doc_vector], topn=number_of_samples):
            instance_dict['instance_'+str(index)].append(similarity)
    for key in instance_dict:
       result_dict[key] = sum(instance_dict[key]) / len(instance_dict[key])
       result_dict[key+'_name'] = instance_mapper[key]

    number_of_samples = min(20, len(instances[0]['Instances']))
    for i in range(number_of_samples):
            instance_dict['instance_'+str(i)] = []
    if( ins != ''):
        tokenized_instances_sentences.append(word_tokenize(ins.lower()))
        instance_dict['instance_'+str(number_of_samples)] = []
        number_of_samples = number_of_samples + 1
    for example in negative_examples:
        test_doc = word_tokenize(example['input'].lower())
        test_doc_vector = model.infer_vector(test_doc)
        for index, similarity in model.dv.most_similar(positive = [test_doc_vector], topn=number_of_samples):
            instance_dict['instance_'+str(index)].append(similarity)
    for key in instance_dict:
       result_dict2[key] = sum(instance_dict[key]) / len(instance_dict[key])
       result_dict2[key+'_name'] = instance_mapper[key]
    return { "positive" : result_dict, "negative" : result_dict2}
