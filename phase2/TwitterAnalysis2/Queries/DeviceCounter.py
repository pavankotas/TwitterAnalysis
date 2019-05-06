from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":
    spark = SparkSession.builder.appName("LocationCounter").getOrCreate()
    # lines = spark.sparkContext.textFile("../hashtags.txt")
    df = spark.read.json("../input/CountryDeviceVerifiedFile.txt")
    # df.groupBy("country").count().show()

    df.createOrReplaceTempView("Tweets")
    results = spark.sql("SELECT COUNTRY as Country,sum(case when source like '%iphone%' then 1 else 0 end) Iphone,\
                                sum(case when source like '%android%' then 1 else 0 end) Android, \
                                count(*) as Total FROM Tweets GROUP BY COUNTRY")
    # results.show()
    dpf = results.toPandas()
    dpf.to_csv('../output/DeviceTweets/device.csv')

    spark.stop()
