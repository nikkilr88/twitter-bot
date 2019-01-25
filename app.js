// require('dotenv').config()

const Bot = require('./config/bot'),
  { setIntervalImediate, rand } = require('./helpers/utils'),
  { hashtags, users, block } = require('./helpers/track'),
  { retweet, isReply } = require('./helpers/tweetFunctions'),
  tweetVid = require('./helpers/getVid')

//Post random YT coding video
setIntervalImediate(tweetVid, 1000 * 60 * 60 * 2)

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: hashtags, follow: users })

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
  //Retweet if tweet is not a reply and not that one annoying user
  if (!isReply(tweet) && block.indexOf(tweet.user.id_str) == -1) {
    let extended = tweet.extended_tweet

    if (!tweet.truncated && tweet.entities.hashtags.length <= 4) {
      console.log('LENGTH: ', tweet.entities.hashtags.length)
      rand(10) === 5 && retweet(tweet.id_str)
    } else if (extended != null && extended.entities.hashtags.length <= 4) {
      console.log('LENGTH EXTENDED: ', extended.entities.hashtags.length)
      rand(10) === 5 && retweet(tweet.id_str)
    }
  }
})
