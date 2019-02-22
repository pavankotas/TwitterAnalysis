import re
with open("tweets.txt",'r') as inputfile:
	file=open("hashtags_urls.txt",'a')
	for line in inputfile:
		urls=' '.join(re.findall(r"http[s]?:\\/\\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\), ]|(?:%[0-9a-fA-F][0-9a-fA-F]))+",line))
		#print(urls)
		file.write(str(urls))
	file.close()	
with open("tweets.txt",'r') as inputfile:
	file=open("hashtags_urls.txt",'a')
	for line in inputfile:
               hashtags=' '.join(re.findall(r"#\w+",line))
               #print(hashtags)
         	file.write(str(hashtags))
        file.close()

