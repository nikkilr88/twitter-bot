var Twit = require("twit"),
    hashtags = require("./helper-files/hashtags");

var Bot = new Twit({
    consumer_key: consumer_key,
    consumer_secret: consumer_secret,
    access_token: access_token,
    access_token_secret: access_token_secret
});

var tweetStream = Bot.stream('statuses/filter', { track: hashtags });
var followStream = Bot.stream('user');

followStream.on('follow', followed);

tweetStream.on('tweet', function(tweet) {
    if(!isReply(tweet)){
        var tweetId = tweet.id_str;
        retweet(tweetId);
    }
});


//Retweet tweets of followed hastags
function retweet(tweetId) {
    
    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if (err) {
            console.log("Something went wrong... :(");
        }
        else {
            console.log("Retweeted! :)");
        }
    });
}

//Follow users back
function followed(event){
    var userId = event.source.id;
    
    Bot.post('friendships/create', {id: userId}, function(err, data, response){
        if(err) {
            console.log("Something went wrong... :(")
        } else {
            console.log("Followed back!");
        }
    });
}

//Check if tweet is retweet
function isReply(tweet) {
  if ( tweet.retweeted_status
    || tweet.in_reply_to_status_id
    || tweet.in_reply_to_status_id_str
    || tweet.in_reply_to_user_id
    || tweet.in_reply_to_user_id_str
    || tweet.in_reply_to_screen_name )
    return true
}