import ssl
import urllib
import pandas as pd
import matplotlib.pyplot as plt
from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient



if __name__ == "__main__":
    spark = SparkSession.builder.appName("JsonToCsvConverter").getOrCreate()
    # lines = spark.sparkContext.textFile("../hashtags.txt")
    df = spark.read.json("../input/master.json")
    df.createOrReplaceTempView("Countries")
    results = spark.sql("SELECT name as Country, id \
                                FROM Countries")
    # results.show()
    dpf = results.toPandas()
    dpf.to_csv('../output/country_master.csv')

    # data = pd.read_csv('country.csv')
    # print(data)
    #
    # plt.bar(data['COUNTRY'], data['Count'])
    # # data.plot.bar(x='loc',y='number_of_tweets')
    # plt.ylabel('Number of Tweets')
    # plt.xlabel('Name of the Country')
    # plt.title('Country Contributions')
    # plt.xticks(fontsize=5, rotation=70)
    # plt.yticks(fontsize=5)
    # plt.show()

    # pd.to_json('../country.json')
    spark.stop()
    quit();
