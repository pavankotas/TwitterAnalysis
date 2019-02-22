import re
import json
with open("../input/tweets.txt",'r') as inputfile:
	### Extracting urls from tweets
	urls_file=open("../input/urls.txt",'a')
	for line in inputfile:
	    	try:
	   		urldata = json.loads(line).get('entities').get('urls')
			for obj in urldata:
				urls_file.write(obj.get('url')+' ')
				urls_file.write(obj.get('expanded_url')+' ')
				urls_file.write(obj.get('display_url')+' ')
		except BaseException as e:
			continue
	urls_file.close()




        		
