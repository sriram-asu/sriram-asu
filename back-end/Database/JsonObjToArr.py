from os import listdir
from os.path import isfile, join

# Add the path to your data to the mypath variable
mypath = r"C:\Users\Admin\IdeaProjects\natural-instructions-expansion\tasks"
onlyfiles = [f for f in listdir(mypath) if isfile(join(mypath, f))]

# print(onlyfiles)
for i in range(len(onlyfiles)):
    with open(mypath+'\\'+onlyfiles[i], 'r+', encoding="utf8") as f:
        content = f.read()
        f.seek(0, 0)
        f.write('[' + '\n' + content+']')
