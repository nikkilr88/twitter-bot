var Twit = require("twit"),
    tracking = require("./helper-files/track");

//Bot config
var Bot = new Twit({
    consumer_key: process.env.consumer_key,
    consumer_secret: process.env.consumer_secret,
    access_token: process.env.access_token,
    access_token_secret: process.env.access_token_secret
});

//Stream config to follow users and hashtags
var tweetStream = Bot.stream('statuses/filter', { track: tracking.hashtags, follow: tracking.users });
// var followStream = Bot.stream('user');

//Listen for follow events
// followStream.on('follow', followed);

//Listen for tweet events from tracked hashtags and users
tweetStream.on('tweet', function(tweet) {
    if (!isReply(tweet)) {
        var tweetId = tweet.id_str;
        console.log(tweet.text);
        retweet(tweetId);
    }
});

//Retweet tweets of followed hastags
function retweet(tweetId) {

    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if (err) {
            console.log("Something went wrong... :(");
            console.log(err);
        }
        else {
            console.log("Retweeted! :)");
        }
    });
}

//Follow users back
function followed(event) {

    var screenName = event.source.screen_name;

    if (screenName !== "GitLit000") {
        Bot.post('friendships/create', { screen_name: screenName }, function(err, data, response) {
            if (err) {
                console.log("Something went wrong... :(")
                console.log(err);
            }
            else {
                console.log("Followed back!");
            }
        });
    }
}

//Check if tweet is retweet
function isReply(tweet) {
    if (tweet.retweeted_status ||
        tweet.in_reply_to_status_id ||
        tweet.in_reply_to_status_id_str ||
        tweet.in_reply_to_user_id ||
        tweet.in_reply_to_user_id_str ||
        tweet.in_reply_to_screen_name)
        return true
}
