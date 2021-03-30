import re
import string
import json
from pattern3.text.en import singularize

#make a pattern for punctuations to remove in text
remove_punctuations = string.punctuation #string.punctuation has !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
pattern_for_punc = r"[{}]".format(remove_punctuations) #creates regex for replacing punctuations

#make a list of stop words for removing in text
with open('document-dataset/stopwords.txt', 'r') as s:
    words = s.read()
    words = words.split('\n')
    stop_words = [word for word in words if word]

#initialise positional index
positional_index = {}

for doc_id in range(1,51):
    with open("document-dataset/documents/"+str(doc_id)+".txt" , 'r') as f:
        #read data file by file for index construction
        data = ""
        data = f.read()

        data = re.split(r'\s|-|—' ,data)
        data = [word for word in data if word]

        for position, word in enumerate(data):
            #text processing for casefolding, stop-words removal and stemming respectively
            word = word.lower()
            word = re.sub(pattern_for_punc, "", word)
            word = re.sub(r'——|”|“', r'', word)
            word = re.sub(r'’|‘|ª|ã|©|¯', r'', word)
            if(word in stop_words):
                word = ""
            word = singularize(word)
            #filters all >=2 chars for words
            if(len(word) >= 3):
                if(word in positional_index):
                    positional_index[word].append((doc_id, position))
                else:
                    positional_index[word] = [(doc_id, position)]

with open('public/data.json' , 'w') as m:
    m.write(json.dumps(positional_index))