import os
import openai
from bson.objectid import ObjectId
import pymongo
#from heatmap import calculate_heat

def call_gpt(input_data):
    # Load your API key from an environment variable or secret management service
    openai.api_key = "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"
    gpt_output = {}
    print(input_data)
    output_textfile = open("output.txt", "w")
    for definitions, values in input_data.items():
        definition_and_examples = definitions
        instance_dict = {}
        for inputs,out in values.items():
            instances = inputs
            print(instances)
            outputs = out

            # for i in range(len(instances)):

            prompt = definition_and_examples + instances[0]
            response = openai.Completion.create(engine="davinci-instruct-beta-v3", prompt=prompt, max_tokens=50)
            strip_response = response['choices'][0]['text'].strip()
            first_response = strip_response.split('?')[0] + '?'
            output_textfile.write("instance: " + "\n" + instances + "\n")
            output_textfile.write("response: " +  "\n" + first_response + "\n\n")

    #         instance_dict[instances] = first_response
    #         output_textfile = open("output.txt", "w")
    #         output_textfile.write(element + "\n")
    #         output_textfile.close()
    #     # print(response['choices'][0]['text'])
    #     gpt_output[definitions] = instance_dict
    # print(gpt_output)
    output_textfile.close()
    return


def fetch_data(selected_task):
    input_output = open("input.txt", "w")
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    database = client["TestDB2"]
    k_closest = database["k_closest"]
    embeddings = database["embeddings"]
    testcol = database["testcol"]
    selected_task = '619f0947d86dd355fbfbcffa'
    documents = k_closest.find({ 'task_id' : selected_task },{ 'task_id': 1,'neighbours' : 1})
    neighbours = []
    for document in documents:
        for n in document['neighbours']:
            keys = list(n.keys())
            neighbours.append(keys[0])
    neighbours.append(selected_task)
    output_dict = {}
    for task_id in neighbours:
        result_dict = {}
        task_definition = embeddings.find({ '_id': ObjectId(task_id) },{"definition":1})
        instances = testcol.find({ 'Definition': task_definition[0]['definition'] },{"Instances":1})
        number_of_samples = min(1, len(instances[0]['Instances']))
        for i in range(number_of_samples):
            result_dict[instances[0]['Instances'][i]['input'].lower()] = instances[0]['Instances'][i]['output'][0].lower()
            val = instances[0]['Instances'][i]['output'][0].lower()
            input_output.write("output: " + "\n" + val + "\n\n")
        output_dict[task_definition[0]['definition']] = result_dict
    #call_gpt(output_dict)
    #print(output_dict)
    input_output.close()
    return

fetch_data('619f0947d86dd355fbfbcffa')
