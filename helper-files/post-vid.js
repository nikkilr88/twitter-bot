var request = require('request'),
    tracking = require('./track'),
    functions = require('./tweet-functions'),
    baseURL = 'https://www.youtube.com/watch?v=';

var url = 'https://www.googleapis.com/youtube/v3/search?key=' + /*keys.yt*/ process.env.yt_key + '&channelId=' + tracking.ytChannels[rand(4)] + '&part=snippet,id&order=date&maxResults=50';

//Get random number
function rand(max) {
    return Math.floor(Math.random() * max);
}

module.exports = function() {
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
                functions.postVid(vidId, status);
            }
        }
    });

}
