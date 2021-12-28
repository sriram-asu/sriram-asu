NLP Test Bed

Before running any react scripts please have latest version of node and npm installed

Steps to run the front-end
1. cd to "front-end" module
2. Run npm -i (this might take a few minutes)
3. Run npm start ( this should open a development server)

Before running any python scripts please run "pip install -r requirement.txt" on the \project_mentored_project_3_group-nlp-test-bed path

Steps to run the back-end services

1.Download the nlp task dataset

2.Start a local mongo daemon

3.Load these data using the scripts \back-end\Database\JsonObjToArr.py

4.Load these data using the scripts \back-end\Database\database.py

This should create a database called "TestDB2" and collection called "testcol"

Run the \back-end\Database\sentence_embeddings.py to create the "embeddings"
collection

Run the \back-end\Database\k_closest.py to create the "k_closest"
collection which should now have the k closest neighbours for a task.

Run the \back-end\Database\writeToFile.py to create the "embedding.js"
file in the front-end\src\Components folder ("remember to change the local path")

Once this is done the sphere should load up in the UI.

For the Beeswarm plot run the below command in front-end\public folder where data_beeswarm.json is present
Please install mongoimport (MongoDB developer tools) and then run the below command
mongoimport --jsonArray --db TestDB2 --collection testcol2 --file data_beeswarm.json

Now to start the other back services.
CD to \back-end\Api\
Now run the app.py file to start the Flask Server.

Now all the interactions and visualisations would work.

To run the GPT model we need openai library. 
The openai api key which is unique needs to be generated from openai website.
Fetch_data function calls call_gpt function which generates the model output.

To run the GPT model run the file call_gpt_updated.py in the \back-end\Api\ folder.


