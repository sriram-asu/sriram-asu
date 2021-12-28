import os
import json
from flask_pymongo import PyMongo
import flask
from flask import request
from bias_panel_t1 import calculate_t1
from bias_panel_t1 import calculate_t2
from t3 import calculate_t3
from t3 import calculate_t4
from t8 import calculate_t8
from t10 import calculate_t10
from bson.objectid import ObjectId
from heatmap import calculate_heat
from chord import calculate_chord


import nltk
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

app = flask.Flask(__name__)

# change the DB name as per requirement
mongodb_client = PyMongo(app, uri="mongodb://localhost:27017/TestDB2")
db = mongodb_client.db
db.instance.delete_many({})
# Change the functions for your respective plots


# http://127.0.0.1:5000/definition/61945542a679803a28684755
@app.route("/definition/<id>")
def definition(id):
    documents = db.embeddings.find({'_id': ObjectId(id)}, {"definition": 1})
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)

# http://127.0.0.1:5000/neighbours/61945542a679803a28684755


@app.route("/neighbours/<id>")
def k_closest(id):
    db.instance.delete_many({})
    documents = db.k_closest.find(
        {'task_id': id}, {'task_id': 1, 'neighbours': 1})
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t1/619c81f241f91ace9bf5ced9


@app.route("/bias_t1/<task_id>")
def bias_t1(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t1(task_id, ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t2/619c81f241f91ace9bf5ced9


@app.route("/bias_t2/<task_id>")
def bias_t2(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t2(task_id, ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t3/619c81f241f91ace9bf5ced9


@app.route("/bias_t3/<task_id>")
def bias_t3(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t3(task_id, ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t4/619c81f241f91ace9bf5ced9


@app.route("/bias_t4/<task_id>")
def bias_t4(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t4(task_id, ['JJ', 'JJR', 'JJS'], ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t5/619c81f241f91ace9bf5ced9


@app.route("/bias_t5/<task_id>")
def bias_t5(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t4(task_id, ['RB', 'RBR', 'RBS'], ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t6/619c81f241f91ace9bf5ced9


@app.route("/bias_t6/<task_id>")
def bias_t6(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t4(
        task_id, ['VB', 'VBD', 'VBG', 'VBN', 'VBP', 'VBZ'], ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t7/619c81f241f91ace9bf5ced9


@app.route("/bias_t7/<task_id>")
def bias_t7(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t4(task_id, ['NN', 'NNS', 'NNP', 'NNPS'], ins))
    return json.dumps(response)


# http://127.0.0.1:5000/bias_t8/619c81f241f91ace9bf5ced9
@app.route("/bias_t8/<task_id>")
def bias_t8(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t8(task_id, 2, ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t9/619c81f241f91ace9bf5ced9


@app.route("/bias_t9/<task_id>")
def bias_t9(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t8(task_id, 3, ins))
    return json.dumps(response)

# http://127.0.0.1:5000/bias_t10/619c81f241f91ace9bf5ced9


@app.route("/bias_t10/<task_id>")
def bias_t10(task_id):
    response = []
    documents = db.instance.find({'task_id': task_id}, {
                                 'task_id': 1, 'instance': 1})
    ins = ''
    for item in documents:
        ins = str(item['instance'])
    response.append(calculate_t10(task_id, ins))
    return json.dumps(response)


@app.route("/sphere_plot")
def sphere_pot():
    print("sphere_plot")
    documents = db.testcol.find().limit(20)
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)


@app.route("/network_plot")
def network_plot():
    print("network_plot")
    documents = db.testcol.find().limit(20)
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)


@app.route("/swarm_plot")
def swarm_plot():
    print("swarm_plot")
    documents = db.testcol2.find()
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)


@app.route("/sankey_plot")
def sankey_plot():
    print("sankey_plot")
    documents = db.testcol.find().limit(20)
    response = []
    for document in documents:
        document['_id'] = str(document['_id'])
        response.append(document)
    return json.dumps(response)

# http://127.0.0.1:5000/heatmap/619c81f241f91ace9bf5ced9


@app.route("/heatmap/<task_id>")
def heatmap(task_id):
    response = []
    temp = calculate_heat(task_id)
    for key in temp:
        response.append(temp[key])
    return json.dumps(response)


@app.route("/chord/<task_id>")
def chord_plot(task_id):
    response = []
    temp = calculate_chord(task_id)
    return json.dumps(temp)


# http://127.0.0.1:5000/instance/619c81f241f91ace9bf5ced9
@app.route("/instance/<task_id>",  methods=['POST'])
def instance(task_id):
    response = []
    db.instance.delete_one({'task_id': task_id})
    instance = request.json.get('instance')
    db.instance.insert_one({'task_id': task_id, 'instance': instance})
    return json.dumps({})


if __name__ == '__main__':
    app.run(debug=True)
