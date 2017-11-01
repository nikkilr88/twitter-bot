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
    if (!functions.isReply(tweet) && !tracking.blocked.includes(tweet.user.id_str)) {
        
        console.log('New tweet: ' + tweet.text + '\n');
        functions.retweet(tweet.id_str);
    }
});
