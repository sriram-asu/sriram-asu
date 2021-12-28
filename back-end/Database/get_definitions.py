import json
import pymongo
from bson.objectid import ObjectId

client = pymongo.MongoClient("mongodb://localhost:27017/")
database = client["TestDB2"]
collection = database["embeddings"]
ids = [
'619b7eb9fc907fde05ecd480', '619b7eb9fc907fde05ecd4e9', '619b7eb8fc907fde05ecd41e', '619b7eb9fc907fde05ecd481', '619b7ebafc907fde05ecd4ea', '619b7eb9fc907fde05ecd4e8', '619b7eb7fc907fde05ecd308', '619b7eb8fc907fde05ecd3f6', '619b7ebafc907fde05ecd4eb', '619b7ebcfc907fde05ecd66f', '619b7eb9fc907fde05ecd481'
]
for id in ids:
    task = collection.find({ '_id': ObjectId(id) },{"definition":1,"x":1, "y" :1, "z":1})
    print(task[0]['definition'])
    print('\n')
    print('---------------------------------------------------------------------------------------------')


