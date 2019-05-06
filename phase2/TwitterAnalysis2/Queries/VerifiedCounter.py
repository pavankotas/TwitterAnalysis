from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":
    spark = SparkSession.builder.appName("VerifiedCounter").getOrCreate()
    # lines = spark.sparkContext.textFile("../hashtags.txt")
    df = spark.read.json("../input/CountryDeviceVerifiedFile.txt")
    # df.groupBy("country").count().show()

    df.createOrReplaceTempView("Tweets")
    results = spark.sql("SELECT COUNTRY as Country, count(*) Total, sum(case when verified like '%true%' \
     then 1 else 0 end) Verified, sum(case when verified like '%false%' then 1 else 0 end) Nonverified \
     from Tweets group by country\
      order by Total desc")
    dpf = results.toPandas()
    dpf.to_csv('../output/VerifiedTweets/verified.csv')
    spark.stop()
