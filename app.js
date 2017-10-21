var Twit = require("twit"),
    hashtags = require("./helper-files/hashtags");

var Bot = new Twit({
    consumer_key: 'tH02ixMNnsfLlbP1N6dIcX2zu', //process.env.consumer_key,
    consumer_secret: 'TdeRvhO75zFFsK6bEgQMPwvo6zz67tL3oovHOIA15SueON0iAE', //process.env.consumer_secret,
    access_token: '921765201191596032-qUTk13T10ypGdzPzGVTGR63ALZ02vuA' ,//process.env.access_token,
    access_token_secret: 'TFNko2PnEEaxA6EsR2s8TojmaoNaQoexbkr2e0Jkv1ByP' //process.env.access_token_secret
});

var tweetStream = Bot.stream('statuses/filter', { track: hashtags });
var followStream = Bot.stream('user');

followStream.on('follow', followed);

tweetStream.on('tweet', function(tweet) {
    if (!isReply(tweet)) {
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
function followed(event) {
    var screenName = event.source.screen_name;

    console.log(event);

    if (screenName !== "gitLit000") {
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
