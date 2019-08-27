const TwitchBot = require('twitch-bot')

var api = require('twitch-api-v5');

api.clientID = '';
api.debug = true;

// api.users.usersByName({ users: ['starcat'] }, (err, res) => {
//   if(err) {
//       console.log(err);
//   } else {
//       console.log(res);
//   }
// });

// console.log(api.streams.channel)

api.search.streams({query: 'starcat'}, (err, res) => {
  if(err) {
      console.log(err);
  } else {
      console.log(res);
  }
});
 
const Bot = new TwitchBot({
  username: 'fairfruitbot',
  oauth: '',
  channels: ['fairfruit']
})
 
Bot.on('join', channel => {
  console.log(`Joined channel: ${channel}`)
})
 
Bot.on('error', err => {
  console.log(err)
})
 
Bot.on('message', chatter => {
  if(chatter.message === '!test') {
    Bot.say('Command executed! PogChamp')
  }
})

var minutes = 1, the_interval = minutes * 60 * 1000;
setInterval(function() {
    Bot.say("It's been 5 minutes!")
}, the_interval);