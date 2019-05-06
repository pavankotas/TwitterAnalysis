from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":
    spark = SparkSession.builder.appName("LanguageCounter").getOrCreate()
    # lines = spark.sparkContext.textFile("../hashtags.txt")
    df = spark.read.json("../input/LanguageFile.txt")
    # df.groupBy("country").count().show()

    df.createOrReplaceTempView("Tweets")
    results = spark.sql("SELECT language,count(*) as total FROM Tweets  \
                            where language is NOT NULL \
                            group by language order by total desc")
    # results.show()
    dpf = results.toPandas()
    dpf.to_csv('../output/LanguageTweets/language.csv')
    spark.stop()
    quit()
    quit()
