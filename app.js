const TwitchBot = require('twitch-bot')

var api = require('twitch-api-v5');

// Constants
const CHANNELS = ['FairFruit'];
const WATER_INTAKE_MS_ML = 105 / 60 / 60 / 1000;
const VOLUME_CUP_ML = 236;
const OZ_TO_ML = 0.034

// dotenv init
const dotenv = require('dotenv');
dotenv.config();

// API Client settings
api.clientID = process.env.CLIENT_ID;
api.debug = false;

function msToReadableTime(milliseconds){
  //Get hours from milliseconds
  var hours = milliseconds / (1000*60*60);
  var absoluteHours = Math.floor(hours);
  var h = absoluteHours > 9 ? absoluteHours : absoluteHours;

  //Get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteMinutes = Math.floor(minutes);
  var m = absoluteMinutes > 9 ? absoluteMinutes : absoluteMinutes;

  //Get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteMinutes) * 60;
  var absoluteSeconds = Math.floor(seconds);
  var s = absoluteSeconds > 9 ? absoluteSeconds : absoluteSeconds;

  hString = hours >= 1? h + ' hours, ' : '';
  mString = minutes >= 1? m + ' minutes, ' : '';
  sString = 'and ' + s + ' seconds';
  
  return hString + mString + sString;
}

function getThirstyString(milliseconds) {
  var amountMl = Math.round(milliseconds * WATER_INTAKE_MS_ML);
  var amountOz = Math.round(amountMl * OZ_TO_ML);
  
  var measure = 'mL'
  if(amountMl >= 1000) {
    amountMl /= 1000;
    measure = 'L'
  }

  return amountOz + "oz (" + amountMl + measure + ")"
}

function getUptime(startTime) {
  return Math.abs((new Date()).getTime() - (new Date(startTime)).getTime());
}

// Twitch Bot API Settings
const Bot = new TwitchBot({
  username: 'fairfruitbot',
  oauth: process.env.OAUTH,
  channels: CHANNELS
})
 
// Twitch Bot API
Bot.on('join', channel => {
  console.log(`Joined channel: ${channel}`)
})
 
Bot.on('error', err => {
  console.log(err)
})
 
// Bot.on('message', chatter => {
//   if(chatter.message === '!test') {
//     Bot.say('Command executed! PogChamp')
//   }
// })

var facts = [
  "68.7% of the fresh water on Earth is trapped in glaciers.",
  "30% of fresh water is in the ground.",
  "1.7% of the world’s water is frozen and therefore unusable.",
  "Approximately 400 billion gallons of water are used in the United States per day.",
  "Nearly one-half of the water used by Americans is used for thermoelectric power generation.",
  "In one year, the average American residence uses over 100,000 gallons (indoors and outside).",
  "Water can dissolve more substances than any other liquid including sulfuric acid.",
  "The freezing point of water lowers as the amount of salt dissolved in at increases. With average levels of salt, seawater freezes at -2 °C (28.4 °F).",
  "About 6,800 gallons of water is required to grow a day’s food for a family of four.",
  "To create one pint of beer it takes 20 gallons of water.",
  "780 million people lack access to an improved water source.",
  "In just one day, 200 million work hours are consumed by women collecting water for their families.",
  "1/3 what the world spends on bottled water in one year could pay for projects providing water to everyone in need.",
  "Unsafe water kills 200 children every hour.",
  "Water weighs about 8 pounds a gallon.",
  "It takes 120 gallons of water for one egg.",
  "A jellyfish and a cucumber are each 95% water.",
  "70% of the human brain is water.",
  "80% of all illness in the developing world is water related.",
  "Up to 50% of water is lost through leaks in cities in the developing world.",
  "In Nairobi urban poor pay 10 times more for water than in New York.",
  "In some countries, less than half the population has access to clean water.",
  "$260 billion is the estimated annual economic loss from poor water and sanitation in developing countries.",
  "40 billion hours are spent collecting water in Africa alone.",
  "The average cost for water supplied to a home in the U.S. is about $2.00 for 1,000 gallons, which equals about 5 gallons for a penny.",
  "A person can live about a month without food, but only about a week without water.",
  "Water expands by 9% when it freezes.",
  "There is about the same amount of water on Earth now as there was millions of years ago.",
  "The length of the side of a cube which could hold the Earth’s estimated total volume of water in km = 1150.",
  "Children in the first 6 months of life consume seven times as much water per pound as the average American adult.",
  "Americans drink more than one billion glasses of tap water per day.",
  "The United States draws more than 40 billion gallons (151 million liters) of water from the Great Lakes every day—half of which is used for electrical power production.",
  "85% of the world population lives in the driest half of the planet.",
  "Agriculture accounts for ~70% of global freshwater withdrawals (up to 90% in some fast-growing economies).",
  "Various estimates indicate that, based on business as usual, ~3.5 planets Earth would be needed to sustain a global population achieving the current lifestyle of the average European or North American.",
  "Thirty-six states are anticipating water shortages by 2016.",
  "300 tons of water are required to manufacture 1 ton of steel.",
  "1 in 6 gallons of water leak from utility pipes before reaching customers in the US.",
  "American use 5.7 billion gallons per day from toilet flushes.",
  "Refilling a half-liter water bottle 1,740 times with tap water is the equivalent cost of a 99 cent water bottle at a convenience store.",
  "It takes about 12 gallons per day to sustain a human (this figure takes into account all uses for water, like drinking, sanitation and food production).",
  "Each day, we also lose a little more than a cup of water (237 ml) when we exhale it.",
  "By 2025, water withdrawals are predicted to increase by 50 percent in developing countries and 18 percent in developed countries.",
  "By 2025 half the world’s people will live in countries with high water stress.",
  "A water-efficient dishwasher uses as little as 4 gallons per cycle but hand washing dishes uses 20 gallons of water.",
  "The average family of four uses 180 gallons of water per day outdoors. It is estimated that over 50% is wasted from evaporation, wind, or overwatering.",
  "It takes more than twice the amount of water to produce coffee than it does tea.",
  "Chicken and goat are the least water intensive meats to consume.",
  "There have been 265 recorded incidences of water conflicts from 3000 BC to 2012.",
  "Hot water can freeze faster than cold water under some conditions (commonly known as the Mpemba effect).",
  "If the entire world’s water were fit into a 4 liter jug, the fresh water available for us would equal only about one tablespoon.",
  "Over 90% of the world’s supply of fresh water is located in Antarctica.",
  "Water regulates the Earth’s temperature.",
  "On average, 10 gallons per day of your water footprint (or 14% of your indoor use) is lost to leaks.",
  "The average pool takes 22,000 gallons of water to fill.",
  "It takes about 70 gallons of water to fill a bathtub.",
  "Flying from Los Angeles to San Francisco, about 700 miles round-trip, could cost you more than 9,000 gallons of water.",
  "Water use has grown at more than twice the rate of population increase in the last century.",
  "Only 0.007 percent of the planet’s water is available to fuel and feed its 6.8 billion people.",
  "Three quarters of all Americans live within 10 miles of polluted water.",
  "A swimming pool naturally loses about 1,000 gallons (3,785 liters) a month to evaporation.",
  "Producing a gallon (3.79 liters) of corn ethanol consumes 170 gallons (644 liters) of water in total, from irrigation to final processing. On the other hand, the water requirement to make a gallon of regular gasoline is just five gallons (19 liters).",
  "40% of freshwater withdrawals in the United States are used for agriculture.",
  "65% of freshwater withdrawals in China are used for agriculture.",
  "Freshwater withdrawals for agriculture exceed 90% in many countries: Cambodia 94%, Pakistan 94%, Vietnam 95%, Madagascar 97%, Iran 92%, Ecuador 92%.",
  "If everyone in the US flushed the toilet just one less time per day, we could save a lake full of water about one mile long, one mile wide and four feet deep.",
  "If everyone in the US used just one less gallon of water per shower every day, we could save some 85 billion gallons of water per year.",
  "Over 42,000 gallons of water (enough to fill a 30×50 foot swimming pool) are needed to grow and prepare food for a typical Thanksgiving dinner for eight.",
  "An acre of corn will give off 4,000 gallons of water per day in evaporation.",
  "In a 100-year period, a water molecule spends 98 years in the ocean, 20 months as ice, about 2 weeks in lakes and rivers, and less than a week in the atmosphere.",
  "Water is the most common substance found on earth.",
  "In Washington state alone, glaciers provide 1.8 trillion liters (470 billion gallons) of water each summer.",
  "Water makes up about 66 percent of the human body.",
  "There are no scientific studies that support the recommendation to drink 8 glasses of water per day.",
  "Drinking too much water can be fatal (known as water intoxication).",
  "There is more fresh water in the atmosphere than in all of the rivers on the planet combined.",
  "If all of the water vapor in the Earth’s atmosphere fell at once, distributed evenly, it would only cover the earth with about an inch of water.",
  "It takes seven and a half years for the average American residence to use the same amount of water that flows over the Niagara Falls in one second (750,000 gallons).",
  "263 rivers either cross or demarcate international political boundaries.",
  "Of the estimated 1.4 billion hectares of crop land worldwide, around 80 percent is rainfed and accounts for about 60 percent of global agricultural output (the other 40% of output is from irrigated crop land)."
]

var the_interval = 15 * 60 * 1000;
setInterval(function() {
    channels.forEach(channel => {
      api.search.streams({query: channel}, (err, res) => {
        if(err) {
            console.log(err);
        } else {
          res.streams.forEach(stream => {
            if(stream.channel.name != channel.toLowerCase()) {
                if(Math.random() >= 0.5) {
                  var uptime = getUptime(stream.created_at);
                  var amount = getThirstyString(uptime);
                  var uptimeHuman = msToReadableTime(uptime);

                  Bot.say(stream.channel.display_name + ", you doof 🤓! It's been " + uptimeHuman + " since your broadcast started 😮. By now, you should've consumed " + amount + " water 💧 to maintain optimal hydration 💪.");
                } else {
                  var fact = facts[Math.floor(Math.random()*facts.length)];
                  Bot.say(fact);
                }
              }
          });
        }
      });
    });
}, the_interval);