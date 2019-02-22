import org.apache.spark._
import org.apache.spark.SparkContext._
object TweetsWordCount {
  def main(args: Array[String]) {

      val config = new SparkConf().setAppName("TweetsWordCount")
      val sc = new SparkContext(config)

      val hashtags = sc.textFile("hdfs://localhost:9000/input_mapr/hashtags_final.txt")
      val hashtag_counts = hashtags.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
      hashtag_counts.saveAsTextFile("hdfs://localhost:9000/output_spark_mapr/hashtags")



      val urls = sc.textFile("hdfs://localhost:9000/input_mapr/urls_final.txt")
      val url_counts = urls.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
      url_counts.saveAsTextFile("hdfs://localhost:9000/output_spark_mapr/urls")

  }
}
