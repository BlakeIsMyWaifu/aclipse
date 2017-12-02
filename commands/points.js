const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const settings = client.settings.get(message.guild.id);
  var user = message.mentions.users.first() || message.author;
  var gscore = client.gpoints.get(user.id) || { points: 0, level: 0 };
  var spoints = client.spoints.get(message.guild.id);
  if (!(user.id in spoints)) {
    spoints[user.id] = [0, 0];
    client.spoints.set(message.guild.id, spoints);
  }
  const pointsEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .setThumbnail(user.avatarURL)
    .setAuthor(`${user.username}#${user.discriminator}`)
    .addField(settings.currency, `Current: ${spoints[user.id][0]}\nTotal: ${spoints[user.id][1]}`)
    .addField('Global Points', `Level: ${gscore.level}\nPoints: ${gscore.points}`);
  return message.channel.send({embed: pointsEmbed});
};

exports.cmdConfig = {
  name: "points",
  aliases: ['point', 'level', 'levels'],
  description: "Displays a users points",
  usage: "points [@user]",
  type: "fun"
};
