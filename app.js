var Twit = require("twit"),
    request = require("request"),
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
var DOCstream = Bot.stream('statuses/filter', { track: ['100daysofcode'] });

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
    
    console.log(tweet.text);
    console.log(RT.test(tweet.text));
    console.log(" ");

    //Retweet if tweet is not reply, doesn't start with RT and coinFlip returns 0
    if (!isReply(tweet) && !RT.test(tweet.text) && rand(4) === 0) {
        var tweetId = tweet.id_str;
        retweet(tweetId);
    }
});

setInterval(function() {
    
    //Get video data from random YT channels in array
    request('https://www.googleapis.com/youtube/v3/search?key=' + /*keys.yt*/ process.env.yt_key + '&channelId=' + tracking.ytChannels[rand(4)] + '&part=snippet,id&order=date&maxResults=50', function(err, res, body) {
        if (err) {
            console.log(err);
        }
        else {
            var data = JSON.parse(body);
            var vidId = data.items[rand(50)].id.videoId;
            
            //If there is a video id, pass it to the function
            if(vidId){
                postVid(vidId);  
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
            console.log("Retweeted! :)", data.text);
        }
    });
}

//New tutorial post
function postVid(id) {
    
    var baseURL = 'https://www.youtube.com/watch?v=';
    var status = baseURL + id;
    
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
    if (tweet.is_quote_status ||
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