import re
import json
with open("../input/tweets.txt",'r') as inputfile:

	### Extracting hashtags from tweets
	hash_file=open("../input/hashtags.txt",'a')	
	for line in inputfile:
	    	try:
	   		hashdata = json.loads(line).get('entities').get('hashtags')
			for obj in hashdata:
				hash_file.write(obj.get('text')+' ')
		except BaseException as e:
			continue
	hash_file.close()


        		
