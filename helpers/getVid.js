const request = require('request'),
      {  ytChannels } = require('./track'),
      { postVid } = require('./tweetFunctions'),
      baseURL = 'https://www.youtube.com/watch?v=';
    
let url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.yt_key}&channelId=${ytChannels[rand(4)]}&part=snippet,id&order=viewCount&maxResults=50`;

//Get random number
function rand(max) {
    return Math.floor(Math.random() * max);
}

module.exports = function() {
    request(url, function(err, res, body) {
        if(err || res.statusCode !== 200) return console.log('UNABLE TO POST VIDEO');
        
        let data = JSON.parse(body),
            randVid = rand(data.items.length),
            title = data.items[randVid].snippet.title,
            vidId = data.items[randVid].id.videoId,
            channel = data.items[randVid].snippet.channelTitle,
            status = `${title} (${channel}) \n${baseURL}${vidId} \n\n#100DaysOfCode #301DaysOfCode`;
            console.log('VIDEO: ', status);

        //If there is a video id, pass it to the function
        if(vidId) return postVid(vidId, status);
    });
};
