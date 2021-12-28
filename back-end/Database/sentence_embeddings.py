import nltk
nltk.download('punkt')
from nltk.tokenize import word_tokenize
import pymongo
from sklearn.decomposition import PCA
from sklearn.preprocessing import Normalizer
from sklearn.preprocessing import StandardScaler

from gensim.models.doc2vec import Doc2Vec, TaggedDocument


client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["TestDB2"]
collection = database["testcol"]
# task_definitions = collection.find({},{"Definition":1}).limit(10)
task_definitions = collection.find({},{"Definition":1, "Categories" :1,"Source":1})

tasks = []
tokenized_definitions = []
for task_definition in task_definitions:
    tasks.append({"definition" : task_definition['Definition'], "categories" : task_definition['Categories'], "source" : task_definition['Source']} )
    tokenized_definitions.append(word_tokenize(task_definition['Definition'].lower()))

tagged_data = [TaggedDocument(d, [i]) for i, d in enumerate(tokenized_definitions)]
model = Doc2Vec(tagged_data, vector_size = 20, window = 10, min_count = 1)

new_collection = database["embeddings"]
sentence_embeddings = []
for task in tasks:
    sentence_embeddings.append( model.infer_vector(word_tokenize(task["definition"].lower())) )
#     x,y,z = model.infer_vector(word_tokenize(task["definition"].lower()))
#     row = new_collection.insert_one({ "definition" :  task["definition"],"categories" :  task["categories"], "x" : float(str(x)), "y": float(str(y)) , "z" :float(str(z))})



sentence_embeddings = StandardScaler().fit_transform(sentence_embeddings)
pca = PCA(n_components=3)
principalComponents = pca.fit_transform(sentence_embeddings)
#
print(pca.explained_variance_ratio_)
#
for i in range(len(tasks)):
    x,y,z = principalComponents[i][0], principalComponents[i][1], principalComponents[i][2]
    row = new_collection.insert_one({ "definition" :  tasks[i]["definition"],"categories" :  tasks[i]["categories"],"source" :  tasks[i]["source"], "x" : float(str(x)), "y": float(str(y)) , "z" :float(str(z))})

