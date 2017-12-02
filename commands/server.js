const Discord = require('discord.js');

exports.run = (client, message, args) => {
  if (message.guild.available === false) return message.channel.send(':negative_squared_cross_mark: Guild is not available?');
  const settings = client.settings.get(message.guild.id);
  const serverEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .setThumbnail(message.guild.iconURL)
    .addField(message.guild.name, `ID: ${message.guild.id}\nRegion: ${message.guild.region}\nAge: ${message.guild.createdAt.toUTCString()}\nMember Count: ${message.guild.memberCount}\nOwner: ${message.guild.owner.user.username}#${message.guild.owner.user.discriminator} (${message.guild.ownerID})`);
  message.channel.send({embed: serverEmbed});
};

exports.cmdConfig = {
  name: "server",
  aliases: ['serverinfo'],
  description: "Displays infomation about the server.",
  usage: "server",
  type: "info"
};