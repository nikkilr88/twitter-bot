var Twit = require("twit"),
    // keys = require("./helper-files/keys"),
    tracking = require("./helper-files/track");

//Bot config
var Bot = new Twit({
    consumer_key: /*keys.consumer_key,*/ process.env.consumer_key,
    consumer_secret: /*keys.consumer_secret,*/ process.env.consumer_secret,
    access_token: /*keys.access_token,*/ process.env.access_token,
    access_token_secret: /*keys.access_token_secret*/ process.env.access_token_secret
});

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: tracking.hashtags, follow: tracking.users });

//#100DaysOfCode tweeet stream config
var DOCstream = Bot.stream('statuses/filter', { track: ['#100DaysOfCode', '100daysofcode'] });

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
    
    //Retweet if tweet is not a reply
    if (!isReply(tweet) && tweet.user.id_str !== '872974956249960448') {
        var tweetId = tweet.id_str;
        retweet(tweetId);
    }
});

//Listen for #100days of code tweet events
DOCstream.on('tweet', function(tweet) {
    
    //Check if tweet begins with RT
    var RT = new RegExp("^RT", "i");
    
    //Retweet if tweet is not reply, doesn't start with RT and coinFlip returns 0
    if (!isReply(tweet) && !tweet.text.match(RT) && coinFlip() === 0){
        var tweetId = tweet.id_str;
        retweet(tweetId);
    }
});

//Retweet tweets of followed hastags and users
function retweet(tweetId) {

    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Retweeted! :)", data.text);
        }
    });
}

//Check if tweet is retweet or reply
function isReply(tweet) {
    if (tweet.is_quote_status ||
        tweet.retweeted_status ||
        tweet.in_reply_to_status_id ||
        tweet.in_reply_to_status_id_str ||
        tweet.in_reply_to_user_id ||
        tweet.in_reply_to_user_id_str ||
        tweet.in_reply_to_screen_name)
        return true
}

//Function to limit #100daysofcode retweets
function coinFlip(){
  return Math.floor(Math.random() * 2)
}

