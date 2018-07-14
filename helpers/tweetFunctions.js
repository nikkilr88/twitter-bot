var Bot = require('../config/bot');

//Retweet tweets of followed hastags and users
exports.retweet = function(tweetId) {
    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if(err) return console.log(tweetId, err.message);
        console.log('RETWEETED :) ' + data.text + '\n');
    });
};

//Check if tweet is retweet or reply
const RT = /^RT/i;

exports.isReply =  function(tweet) {
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
exports.postVid = function(id, status) {
    Bot.post('statuses/update', { status: status }, function(err, data, response) {
        if(err) return console.log(err);
        console.log('VIDEO POSTED :) ');
    });
};