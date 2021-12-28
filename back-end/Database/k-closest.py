import heapq
import json
import pymongo
import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
import copy


client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["TestDB2"]
collection = database["embeddings"]
task_definitions = collection.find({},{"definition":1,"x":1, "y" :1, "z":1})
k_closest_collection = database["k_closest"]
definitions = []
id_map = {}
tokenized_definitions = []
for emb in task_definitions:
    emb_dict = {}
    emb_dict['definition'] = emb['definition']
    emb_dict['x'] = emb['x']
    emb_dict['y'] = emb['y']
    emb_dict['z'] = emb['z']
    definitions.append(emb_dict)
    id_map[emb['definition']] = str(emb['_id'])
    tokenized_definitions.append(word_tokenize(emb_dict['definition'].lower()))

tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(tokenized_definitions)]
model = Doc2Vec(tagged_data, vector_size = 100, window = 20, min_count = 1)

definitions_2 = copy.deepcopy(definitions)

for definition in definitions_2:
    test_doc = word_tokenize(definition['definition'].lower())
    test_doc_vector = model.infer_vector(test_doc)
    k_closest = {}
    k_closest['neighbours'] = []
    k_closest['task_id'] = id_map[definition['definition']]
    found = 0
    for index, similarity in model.dv.most_similar(positive = [test_doc_vector], topn=10):
        new_dict = {}
        new_dict[id_map[definitions[index]['definition']]] = similarity
        k_closest['neighbours'].append(new_dict)
        if id_map[definitions[index]['definition']] == id_map[definition['definition']]:
            found = 1
    if found != 1:
        del k_closest['neighbours'][-1]
        new_dict = {}
        new_dict[id_map[definition['definition']]] = 0.9
        k_closest['neighbours'].append(new_dict)
    k_closest_collection.insert_one(k_closest)