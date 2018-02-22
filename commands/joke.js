const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const settings = client.settings.get(message.guild.id);
  var jokeArrayArray = [
    ["Why does everyone think Bacchus is so annoying?", "Because he's always whining", "/u/MaggehG"],
    ["What is Sol's favourite movie?", "Twilight: Breaking Down", "/u/MaggehG"],
    ["Why does everyone think that Xing Tian uses drugs?", "Because he's always Xing things", "/u/MaggehG"],
    ["What type of camera does Vulcan use?", "A cannon", "/u/barblebapkins"],
    ["Why does Medusa make the best weed dealer?", "She loves to help people get stoned", "/u/barblebapkins"],
    ["Did you hear He Bo used to be a celebrity?", "Now he's all washed up", "/u/barblebapkins"],
    ["I told a joke about Awilix to my friend,", "but it went over his head", "/u/barblebapkins"],
    ["Why isn't Sobek ever in a serious relationship?", "Because all he's ever looking for is a fling", "/u/xdapenguinx"],
    ["What's Bellona's favourite restaurant?", "Taco Bellona", "/u/MaggehG"],
    ["Rexsi's winrate", "166641492113358848"]
  ];
  let jokeArray = Object.keys(jokeArrayArray);
  let jokeNumber = /^\d+$/.test(args[0]) ? (jokeArrayArray.length < args[0]) ? client.randomNum(1, jokeArrayArray.length) : args[0] : client.randomNum(1, jokeArrayArray.length);
  let credit = /^\d+$/.test(jokeArrayArray[jokeNumber - 1][jokeArrayArray[jokeNumber - 1].length - 1]) ? `${client.users.get(jokeArrayArray[jokeNumber - 1][jokeArrayArray[jokeNumber - 1].length - 1]).username}#${client.users.get(jokeArrayArray[jokeNumber - 1][jokeArrayArray[jokeNumber - 1].length - 1]).discriminator}` : jokeArrayArray[jokeNumber - 1][jokeArrayArray[jokeNumber - 1].length - 1];
  const jokeEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .setFooter(`#${jokeNumber} credit: ${credit}`);
  if (jokeArrayArray[jokeNumber - 1].length === 2) jokeEmbed.setTitle(jokeArrayArray[jokeNumber - 1][0]);
  if (jokeArrayArray[jokeNumber - 1].length === 3) jokeEmbed.addField(`:regional_indicator_q: ${jokeArrayArray[jokeNumber - 1][0]}`, `:regional_indicator_a: ${jokeArrayArray[jokeNumber - 1][1]}`);
  return message.channel.send({embed: jokeEmbed});
};

exports.cmdConfig = {
  name: "joke",
  aliases: ['tellmeajoke'],
  description: "Tells a random joke.",
  usage: "[jokenumber]",
  type: "fun",
  permission: null
};
