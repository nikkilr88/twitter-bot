var Bot = require('../config/bot');

var functions = {};

//Retweet tweets of followed hastags and users
functions.retweet = function(tweetId) {
    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if (err) {
            console.log(tweetId);
            console.log(err.message);
        }
        else {
            console.log('Retweeted! :)' + data.text + '\n');
        }
    });
};

//Check if tweet is retweet or reply
var RT = /^RT/i;

functions.isReply =  function(tweet) {
    if (RT.test(tweet.text) ||
        tweet.is_quote_status ||
        tweet.retweeted_status ||
        tweet.in_reply_to_status_id ||
        tweet.in_reply_to_status_id_str ||
        tweet.in_reply_to_user_id ||
        tweet.in_reply_to_user_id_str ||
        tweet.in_reply_to_screen_name)
        return true;
};

//New tutorial post
functions.postVid = function(id, status) {

    console.log(status);

    Bot.post('statuses/update', { status: status }, function(err, data, response) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Sucessfully posted video! :)");
        }
    });
};

module.exports = functions;