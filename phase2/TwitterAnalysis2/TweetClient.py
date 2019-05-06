from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import credentials as twitter_credentials
import sys

counter = 0


# # # # TWITTER STREAMER # # # #
class TwitterStreamer:

	def __init__(self):
		pass

	def stream_tweets(self, fetched_tweets_filename, geo_box):
		# This handles Twitter authentication and the connection to Twitter Streaming API
		listener = StdOutListener(fetched_tweets_filename)
		auth = OAuthHandler(twitter_credentials.CONSUMER_KEY, twitter_credentials.CONSUMER_SECRET)
		auth.set_access_token(twitter_credentials.ACCESS_TOKEN, twitter_credentials.ACCESS_TOKEN_SECRET)
		stream = Stream(auth, listener)

		# This filters Twitter Streams to capture data by the location:
		# stream.filter(track=['Trump'])
		stream.filter(locations=geo_box)


# # # # TWITTER STREAM LISTENER # # # #
class StdOutListener(StreamListener):

	def __init__(self, fetched_tweets_filename):
		self.fetched_tweets_filename = fetched_tweets_filename

	def on_data(self, data):
		global counter
		try:
			# print counter
			if counter == 100:
				sys.exit()
			# print(data)
			with open(self.fetched_tweets_filename, 'a') as tf:
				tf.write(data)
			counter = counter + 1
			return True
		except BaseException as e:
			print("Error on_data %s" % str(e))
		return True

	def on_error(self, status):
		print(status)


if __name__ == '__main__':
	# Authenticate using config.py and connect to Twitter Streaming API.
	box = [-180, -90, 180, 90]
	filename = "tweets_final.txt"
	twitter_streamer = TwitterStreamer()
	twitter_streamer.stream_tweets(filename, box)

