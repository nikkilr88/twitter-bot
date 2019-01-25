// require('dotenv').config()

const Bot = require('./config/bot'),
  { setIntervalImediate, rand } = require('./helpers/utils'),
  { hashtags, users, block } = require('./helpers/track'),
  { retweet, isReply } = require('./helpers/tweetFunctions'),
  tweetVid = require('./helpers/getVid')

//Post random YT coding video
setIntervalImediate(tweetVid, 1000 * 60 * 60 * 2)

//Tweet stream config to follow users and hashtags
const Stream = Bot.stream('statuses/filter', {
  track: hashtags,
  follow: users
})

//Listen for tweet events from tracked hashtags and users
Stream.on('tweet', function(tweet) {
  console.log('INCOMING: ', tweet.text)
  if (!isReply(tweet) && !block.includes(tweet.user.id_str)) {
    let extended = tweet.extended_tweet
    if (!tweet.truncated && tweet.entities.hashtags.length <= 4) {
      users.includes(tweet.user.id_str)
        ? retweet(tweet.id_str)
        : rand(10) === 5 && retweet(tweet.id_str)
    } else if (extended != null && extended.entities.hashtags.length <= 4) {
      users.includes(tweet.user.id_str)
        ? retweet(tweet.id_str)
        : rand(10) === 5 && retweet(tweet.id_str)
    }
  }
})
