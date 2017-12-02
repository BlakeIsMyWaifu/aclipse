const Discord = require('discord.js');

exports.run = (client, message, args) => {
  let user = message.mentions.users.first() || message.author;
  let usergm = message.guild.member(message.mentions.users.first()) || message.member;
  if (usergm.roles.array().length === 1) {
    var colour = "#FFFFFF";
    var roleNumber = "Role [0]";
    var roleArray = "no roles yet . . .";
  } else {
    var colour = usergm.highestRole.hexColor;
    var roleNumber = `Role [${usergm.roles.array().length - 1}]`;
    var roleArray = usergm.roles.filter(r => r.id !== message.guild.id).map(role => role.name).join(', ');
  }
  // const statusColours = {
  //   online: 0x23DF49,
  //   idle: 0xffe523,
  //   dnd: 0xff1414,
  //   streaming: 0x930de0,
  //   offline: 0x0,
  // };
  const accountEmbed = new Discord.RichEmbed()
    // .setColor(statusColours[user.presence.status])
    .setColor(colour)
    .setThumbnail(user.avatarURL)
    .setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
    .addField('ID', user.id)
    .addField('Status', user.presence.status)
    .addField('Account Created', user.createdAt.toUTCString())
    .addField('Date Joined Server', usergm.joinedAt.toUTCString())
    .addField('Nickname', usergm.displayName)
    .addField(roleNumber, roleArray);
  return message.channel.send({embed: accountEmbed});
};

exports.cmdConfig = {
  name: "account",
  aliases: ['acc'],
  description: "Displays infomation about a person.",
  usage: "account [@user]",
  type: "info"
};
