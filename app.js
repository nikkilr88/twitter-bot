var Twit = require('twit'),
    request = require('request'),
    // keys = require(''./helper-files/keys'),
    tracking = require('./helper-files/track'),
    blocked = require('./helper-files/block'),
    Bot = require('./config/bot')

var baseURL = 'https://www.youtube.com/watch?v=',
    RT = /^RT/i;
  
//Bot config
// var Bot = new Twit({
//     consumer_key: /*keys.consumer_key,*/ process.env.consumer_key,
//     consumer_secret: /*keys.consumer_secret,*/ process.env.consumer_secret,
//     access_token: /*keys.access_token,*/ process.env.access_token,
//     access_token_secret: /*keys.access_token_secret*/ process.env.access_token_secret
// });

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: tracking.hashtags, follow: tracking.users });

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
    
    console.log(tweet.text);

    //Retweet if tweet is not a reply and not that one annoying user
    if (!isReply(tweet) && !blocked.includes(tweet.user.id_str)) {
        
        console.log('New tweet: ' + tweet.text + '\n');
        retweet(tweet.id_str);
    }
});

setInterval(function() {

    //Get video data from random YT channels in array
    var url = 'https://www.googleapis.com/youtube/v3/search?key=' + /*keys.yt*/ process.env.yt_key + '&channelId=' + tracking.ytChannels[rand(4)] + '&part=snippet,id&order=date&maxResults=50';
    
    request(url, function(err, res, body) {
        if (err) {
            console.log(err);
        }
        else {
            var data = JSON.parse(body),
                randVid = rand(50),
                title = data.items[randVid].snippet.title,
                vidId = data.items[randVid].id.videoId,
                status = title + " " + baseURL + vidId;

            //If there is a video id, pass it to the function
            if (vidId) {

                postVid(vidId, status);
            }
        }
    });
}, 1000 * 60 * 60 * 6);

//Retweet tweets of followed hastags and users
function retweet(tweetId) {

    Bot.post('statuses/retweet/:id', { id: tweetId }, function(err, data, response) {
        if (err) {
            console.log(tweetId);
            console.log(err.message);
        }
        else {
            console.log('Retweeted! :)' + data.text + '\n');
        }
    });
}

//New tutorial post
function postVid(id, status) {

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

//Check if tweet is retweet or reply
function isReply(tweet) {
    if (RT.test(tweet.text) ||
        tweet.is_quote_status ||
        tweet.retweeted_status ||
        tweet.in_reply_to_status_id ||
        tweet.in_reply_to_status_id_str ||
        tweet.in_reply_to_user_id ||
        tweet.in_reply_to_user_id_str ||
        tweet.in_reply_to_screen_name)
        return true
}

//Get random number
function rand(max) {
    return Math.floor(Math.random() * max);
}
