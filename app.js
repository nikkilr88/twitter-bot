var Twit = require('twit'),
    request = require('request'),
    // keys = require(''./helper-files/keys'),
    tracking = require('./helper-files/track'),
    blocked = require('./helper-files/block'),
    Bot = require('./config/bot'),
    functions = require('./helper-files/tweet-functions'),
    tweetVid = require('./helper-files/post-vid');

var baseURL = 'https://www.youtube.com/watch?v=',
    RT = /^RT/i;
    
setInterval(tweetVid, 1000 * 60 * 60 * 6);

//Tweet stream config to follow users and hashtags
var stream = Bot.stream('statuses/filter', { track: tracking.hashtags, follow: tracking.users });

//Listen for tweet events from tracked hashtags and users
stream.on('tweet', function(tweet) {
    
    console.log(tweet.text);

    //Retweet if tweet is not a reply and not that one annoying user
    if (!functions.isReply(tweet) && !blocked.includes(tweet.user.id_str)) {
        
        console.log('New tweet: ' + tweet.text + '\n');
        functions.retweet(tweet.id_str);
    }
});

// setInterval(function() {

//     //Get video data from random YT channels in array
//     var url = 'https://www.googleapis.com/youtube/v3/search?key=' + /*keys.yt*/ process.env.yt_key + '&channelId=' + tracking.ytChannels[rand(4)] + '&part=snippet,id&order=date&maxResults=50';
    
//     request(url, function(err, res, body) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             var data = JSON.parse(body),
//                 randVid = rand(50),
//                 title = data.items[randVid].snippet.title,
//                 vidId = data.items[randVid].id.videoId,
//                 status = title + " " + baseURL + vidId;

//             //If there is a video id, pass it to the function
//             if (vidId) {

//                 functions.postVid(vidId, status);
//             }
//         }
//     });
// }, 1000 * 60 * 60 * 6);

//Get random number
function rand(max) {
    return Math.floor(Math.random() * max);
}
