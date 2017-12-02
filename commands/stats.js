const Discord = require('discord.js');
const pack = require('../package.json');

exports.run = (client, message, args) => {
  let mem = `• Mem Usage : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`;
  let swap = `• Swap Size : ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`;
  let uptime = `• Uptime : ${client.uptime}`;
  let users = `• Users : ${client.users.size}`;
  let servers = `• Servers : ${client.guilds.size}`;
  let channels = `• Channels : ${client.channels.size}`;
  let discordjs = `• Discord.js : v${Discord.version}`;
  let v = `• Bot Version : v${pack.version}`;
  const settings = client.settings.get(message.guild.id);
  let owner = client.users.get(client.config.ownerId);
  const stats = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .addField(client.user.username, `${mem}\n${swap}\n${uptime}\n${users}\n${servers}\n${channels}\n${discordjs}\n${v}`)
    .addField('Owner Contact Details', `Name: ${owner.username}#${owner.discriminator}\nID: ${owner.id}`);
  message.channel.send({embed: stats});
};

exports.cmdConfig = {
  name: "stats",
  aliases: [],
  description: "Provides some information about this bot.",
  usage: "stats",
  type: "info"
};
