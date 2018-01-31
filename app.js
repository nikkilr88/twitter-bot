var Bot = require('./config/bot'),
    tracking = require('./helper-files/track'),
    functions = require('./helper-files/tweet-functions'),
    tweetVid = require('./helper-files/tweet-vid');

//Post random YT coding video
setInterval(tweetVid, 1000 * 60 * 60 * 6);

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: tracking.hashtags, follow: tracking.users });

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
    console.log(tweet.text);
    //Retweet if tweet is not a reply and not that one annoying user
    if (!functions.isReply(tweet) && tracking.block.indexOf(tweet.user.id_str) == -1) {
        
        console.log(tweet);
        
        if(tweet.extended_tweet != null && tweet.extended_tweet.entities.hashtags.length <= 4) {
            console.log('LENGTH EXTENDED: ', tweet.extended_tweet.entities.hashtags.length);
            functions.retweet(tweet.id_str);
        }
        
        if(tweet.retweeted_status != null && tweet.retweeted_status.extended_tweet.entities.hashtags.length <= 4) {
            console.log('LENGTH EXTENDED: ', tweet.retweeted_status.extended_tweet.entities.hashtags.length);
            functions.retweet(tweet.id_str);
        }
        
        if(!tweet.truncated && tweet.entities.hashtags.length <= 4) {
            console.log('LENGTH: ', tweet.entities.hashtags.length);
            functions.retweet(tweet.id_str);
        }
    }
});
