//Leslie Ruckman built this as part of homework for A2Z Fall 2016
// Goals for this project:
// Have a selection of random mantras that can be iterated on
// Use randomness to select a random word
// Use random numbers to select which mantra to tweet.
// Tweet 1 machine mantra per day
// Reply to others with a new mantra

console.log("this is mantra machine.");

//node runs on packages - npm stands for node package manager
//packages contain node functionality.
// run through npm init creates a json installer package.
// when we save more packages, for example Twitter package, then will note these in json file.


var config = require('./config.js');
// require twit node module
var Twit = require('twit');
// require rita node modlue
var rita = require('rita');
// global variable for my feed sentence
var s;

// Making a Twit object for connection to the twitter API
var T = new Twit(config);

//set up a user stream
var stream = T.stream('user');

// look for tweet events
// See: https://dev.twitter.com/streaming/userstreams
stream.on('tweet', tweetEvent);

// Trigger a tweet by tweeting @ the bot
function tweetEvent(eventMsg){
  // var fs = require('fs');
  // var json = JSON.stringify(eventMsg, null,2);
  // fs.writeFile("tweet.json",json);

  var reply_to = eventMsg.in_reply_to_screen_name;
  var sender = eventMsg.user.screen_name;
  var txt = eventMsg.text;
  var tweetMsg = processRita();

  if(reply_to === 'mantra_machine'){
    var replyText = '@'+ sender + " "+ tweetMsg;

    T.post('statuses/update',
    {status: replyText}
    , tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success:' + data.text);
        }
    }
  }
}


// Start once
tweeter();

// Once every 3min to test that it's working
// setInterval(tweeter, 180000);

// Once everyday once it's ready for launch
setInterval(tweeter, 24 * 3,600,000);


function tweeter() {

    var tweet = processRita();
    console.log(tweet);

    T.post('statuses/update',
    {status: "Today's mantra:" + " " + tweet}
    , tweeted);

    function tweeted(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success:' + data.text);
        }
    };
}


function processRita() {
      // Create a random message sorter.
      var num = Math.random(0,1);

      if (num< 0.1){
        s = "Be the change you want to see in the world";
      } else if (num<0.2){
        s = "Where I am right now is exactly where I need to be";
      } else if (num<0.3){
        s = "Every day in every way I’m getting better and better";
      } else if (num <0.4){
        s = "I am that I am";
      }else if (num <0.5){
        s = "I am enough";
      }else if (num<0.6){
        s = "I change my thoughts, I change my world";
      }else if (num <0.7){
        s = "I have a purpose in this life";
      }else if (num <0.8){
        s = "I am a magnet for joy, love, and abundance";
      }else if (num <0.9){
        s = "I am open to the abundance of the universe";
      }else{
        s = "Love is the only miracle there is";
      }
      console.log(num);


    var rs = rita.RiString(s);
    var words = rs.words();
    var pos = rs.pos();
    var lexicon = rita.RiLexicon();

    var mantra = '';
    for (var i = 0; i < words.length; i++) {
        if (pos[i] === 'nn') {
            mantra += lexicon.randomWord('nn');
        } else if (pos[i] === 'jj' || pos[i] === 'jjr') {
            mantra += lexicon.randomWord('jj');
        } else if (words[i] === 'am') {
            mantra += lexicon.randomWord('vb');
        }else {
            mantra += words[i];
        }
        mantra += " ";
    }
    return mantra;

}
