from pyspark.sql import SparkSession
from pyspark.sql import Row
from pyspark.sql import functions
from pymongo import MongoClient
import ssl
import urllib
import pandas as pd




if __name__ == "__main__":

    countries = pd.read_csv('../output/GlobalTweets/country.csv')
    countriesMaster = pd.read_csv('../output/GlobalTweets/country_master.csv')
    filteredCountries = countries[countries['Country'].isin(countriesMaster['Country'])]
    filteredCountries = filteredCountries[['Country','Count']]
    mergedCountries = pd.merge(filteredCountries, countriesMaster, on='Country')
    mergedCountries = mergedCountries[['Country','Count','id']]
    mergedCountries = mergedCountries.rename(index=str, columns={"Country": "name", "Count": "value"})
    mergedCountries.to_csv('../output/GlobalTweets/filteredCountry.csv')

