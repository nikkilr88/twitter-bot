var Twit = require("twit");
// var keys = require('./keys');

module.exports = new Twit({
    consumer_key: /*keys.consumer_key,*/ process.env.consumer_key,
    consumer_secret: /*keys.consumer_secret,*/ process.env.consumer_secret,
    access_token: /*keys.access_token,*/ process.env.access_token,
    access_token_secret: /*keys.access_token_secret*/ process.env.access_token_secret
});