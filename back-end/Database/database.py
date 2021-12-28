from os import listdir
from os.path import isfile, join
import os
import subprocess

# Add the path that contains your datafiles
# mypath = r"C:\Users\Data"
mypath = r"C:\Users\Admin\IdeaProjects\natural-instructions-expansion\tasks"
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

# print(onlyfiles
for i in range(len(onlyfiles)):
    # file = mypath+'\\'+onlyfiles[i]
    file = mypath+'\\'+onlyfiles[i]
    cmd = 'mongoimport --jsonArray --db TestDB2 --collection testcol --file ' + file
    # print(cmd)
    # print(file)
    os.system(cmd)
