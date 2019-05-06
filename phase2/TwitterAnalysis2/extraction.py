import json

with open("tweets_final.txt",'r') as inputfile:
    hash_file = open("hashtags.txt", 'a')
    for line in inputfile:
        try:
            ob = {}
            ob['country'] = json.loads(line).get('place').get('country')
            ob['source'] = json.loads(line).get('source')
            print(ob)
            # hashdata = json.loads(line).get('entities').get('hashtags')
            # for obj in hashdata:
            #     hash_file.write(obj.get('text') + ' ')

            hash_file.write(json.dumps(ob)+"\n")
        except BaseException as e:
            continue
    hash_file.close()


