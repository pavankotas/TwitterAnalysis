Twitter Data Analysis Using Streaming APIs:


 Project Goal: Develop a system to store,analyze and visualize twitter tweets.

 Phase 1:

 Objectives: 
 
  1.Collect tweets using twitter streaming APIs and store in a text file.
  2.Extract Hashtags and Urls from raw text file.
  3.Run word count both in Apache Hadoop and Apache Spark on the extracted Hashtags and Urls.

 Prerrequisites:
 1.Apache Hadoop
 2.Apache Spark
 3.Python
 4.Scala
 5.Java
 6 Tweepy Python Library
 6.Twitter Account.

Configuring Streaming API:

1.Login to the twitter developer platform (https://developer.twitter.com/en/apps)
2.Generate Consumer keys and Access Tokens.


Collecting Tweets:

1.     .py collects the tweets from API using the Access Tokens and Consumer Keys.
2.Collected tweets are stored in tweets_final.text file.

Hashtags And Urls Extraction:
1.      .py extracts the Hashtags,Urls and stores in to Hashtags_final.txt,Urls_final.txt respectively.

Pushing Extracted Files into HDFS:

1.We need to create a directory in HDFS using the following command

  hdfs dfs -mkdir  /path

2.We need to push Hashtags_final.txt,Urls_final.txt into HDFS using the following command.

  hdfs dfs -copyFromLocal /localpath to /hdfs path

Running the Word Count:

1.Run the following command to find the word count on mapreduce.
  
  hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.1.jar wordcount  /hdfs path

2.For the word count on spark, we need to navigate to the bin folder in the archived spark tar folder

  and we need to run the following commands
 
  ./spark-shell
  
  val textFile = sc.textFile("hdfs://localhost:9000/    ")
  
  val counts = textFile.flatMap(line => line.split(" "))
  .map(word => (word,1))
  .reducedBykey(_+_)
  counts.saveasTextFile("hdfs://localhost:9000/       ")





  


 
