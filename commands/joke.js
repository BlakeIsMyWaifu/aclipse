const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const settings = client.settings.get(message.guild.id);
  let jokeList = {
    "Why does everyone think Bacchus is so annoying?": "Because he's always whining",
    "What is Sol's favourite movie?": "Twilight: Breaking Down",
    "Why does everyone think that Xing Tian uses drugs?": "Because he's always Xing things",
    "What type of camera does Vulcan use?": "A cannon",
    "Why does Medusa make the best weed dealer?": "She loves to help people get stoned",
    "Did you hear He Bo used to be a celebrity?": "Now he's all washed up",
    "I told a joke about Awilix to my friend,": "but it went over his head",
    "Why isn't Sobek ever in a serious relationship?": "Because all he's ever looking for is a fling",
    "What's Bellona's favourite restaurant?": "Taco Bellona",
    "Rexsi's winrate": ". . ."
  };
  let jokeArray = Object.keys(jokeList);
  let forceNumber = parseInt(args);
  forceNumber--;
  let joke = jokeArray[Math.floor(Math.random() * jokeArray.length)];
  if (jokeArray[forceNumber] !== undefined) joke = jokeArray[forceNumber];
  let jokeNumber = jokeArray.indexOf(joke);
  jokeNumber++;
  const jokeEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .addField(`:regional_indicator_q: ${joke}`, `:regional_indicator_a: ${jokeList[joke]}`)
    .setFooter(`#${jokeNumber}`);
  return message.channel.send({embed: jokeEmbed});
};

exports.cmdConfig = {
  name: "joke",
  aliases: ['tellmeajoke'],
  description: "Tells a random joke.",
  usage: "joke [jokenumber]",
  type: "fun"
};
