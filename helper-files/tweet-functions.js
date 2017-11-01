var Bot = require('../config/bot');

var functions = {};

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
