const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if (message.guild.available === false) return message.channel.send(':negative_squared_cross_mark: Guild is not available?');
  const settings = client.settings.get(message.guild.id);
  const serverEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .setThumbnail(message.guild.iconURL)
    .addField(message.guild.name, `**ID:** ${message.guild.id}\n**Region:** ${message.guild.region}\n**Age:** ${message.guild.createdAt.toUTCString()}\n**Member Count:** ${message.guild.memberCount}\n**Owner:** ${message.guild.owner.user.username}#${message.guild.owner.user.discriminator} (${message.guild.ownerID})`);
  message.channel.send({embed: serverEmbed});
};

exports.cmdConfig = {
  name: "server",
  aliases: ['serverinfo'],
  description: "Displays infomation about the server.",
  usage: "",
  type: "info",
  permission: null
};