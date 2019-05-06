from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":

    verifiedTweets = pd.read_csv('../output/VerifiedTweets/verified.csv')
    countriesMaster = pd.read_csv('../output/GlobalTweets/country_master.csv')
    filteredCountries = verifiedTweets[verifiedTweets['Country'].isin(countriesMaster['Country'])]
    filteredCountries = filteredCountries[['Country','Verified','Nonverified','Total']]
    filteredCountries.to_csv('../output/VerifiedTweets/filteredVerified.csv')

