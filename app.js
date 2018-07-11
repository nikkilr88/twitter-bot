require('dotenv').config();

const Bot = require('./config/bot'),
      { hashtags, users, block } = require('./helper-files/track'),
      { retweet, isReply } = require('./helper-files/tweet-functions'),
      tweetVid = require('./helper-files/tweet-vid');

//Post random YT coding video every 6 hours
setInterval(tweetVid, 1000 * 60 * 60 * 6);

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: hashtags, follow: users });

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
    console.log('INCOMING: ', tweet.text);
    //Retweet if tweet is not a reply and not that one annoying user
    if (!isReply(tweet) && block.indexOf(tweet.user.id_str) == -1) {
        
        console.log('!ISREPLY: ', tweet);
        let extended = tweet.extended_tweet,
            retweetedExtended = tweet.retweeted_status;
        
        // Skip over tweets with too may hashtags
        // if(extended != null && extended.entities.hashtags.length <= 4) {
        //     console.log('LENGTH EXTENDED: ', extended.entities.hashtags.length);
        //     retweet(tweet.id_str);
        // }
        
        // if(retweetedExtended != null && retweetedExtended.extended_tweet.entities.hashtags.length <= 4) {
        //     console.log('LENGTH EXTENDED: ', retweetedExtended.extended_tweet.entities.hashtags.length);
        //     retweet(tweet.id_str);
        // }
        
        if(!tweet.truncated && tweet.entities.hashtags.length <= 4) {
            console.log('LENGTH: ', tweet.entities.hashtags.length);
            retweet(tweet.id_str);
        } else if (extended != null && extended.entities.hashtags.length <= 4){
            console.log('LENGTH EXTENDED: ', extended.entities.hashtags.length);
            retweet(tweet.id_str);
        } else {
            return;
        }
    }
});
