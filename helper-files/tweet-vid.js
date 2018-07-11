const request = require('request'),
      {  ytChannels } = require('./track'),
      { postVid } = require('./tweet-functions'),
      baseURL = 'https://www.youtube.com/watch?v=';
    
let url = 'https://www.googleapis.com/youtube/v3/search?key=' + process.env.yt_key + '&channelId=' + ytChannels[rand(4)] + '&part=snippet,id&order=date&maxResults=50';

//Get random number
function rand(max) {
    return Math.floor(Math.random() * max);
}

module.exports = function() {
    request(url, function(err, res, body) {
        if(err) return console.log(err);
        
        let data = JSON.parse(body),
            randVid = rand(50),
            title = data.items[randVid].snippet.title,
            vidId = data.items[randVid].id.videoId,
            status = title + " " + baseURL + vidId + ' ' + '#100DaysOfCode';

        //If there is a video id, pass it to the function
        if (vidId) {
            postVid(vidId, status);
        }
    });
};
