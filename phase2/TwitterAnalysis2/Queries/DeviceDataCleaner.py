from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":

    devices = pd.read_csv('../output/DeviceTweets/device.csv')
    countriesMaster = pd.read_csv('../output/GlobalTweets/country_master.csv')
    filteredCountries = devices[devices['Country'].isin(countriesMaster['Country'])]
    filteredCountries = filteredCountries[['Country','Iphone','Android','Total']]
    filteredCountries.to_csv('../output/DeviceTweets/filteredDevice.csv')

