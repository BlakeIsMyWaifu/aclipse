// get the discord.js lib so that we can actually do stuff
const Discord = require('discord.js');

// the first argument we want is the person being banned which is never used but we don't want the first word
exports.run = (client, message, [mentionSpace, ...reason]) => {
  
  // we want to know if the person that is trying to ban has the ban permission
  // we are going to make it into a variable just because we can; i don't know
  let hasPermission = message.member.hasPermission("BAN_MEMBERS");
  
  // we are going to check if they have the permission
  // if they don't then we return a message saying they don't have permission
  if (hasPermission === false) return message.channel.send(':negative_squared_cross_mark: You do not have permission. You need \`BAN_MEMBERS\`');
  
  // we need to get the person to be banned
  let user = message.mentions.users.first();
  
  // if nobody has been mentioned then we don't know who to ban so we return another message
  if (message.mentions.users.size < 1) return message.channel.send(':negative_squared_cross_mark: You must mention someone to ban them');
  
  // we reasign what reason is because it is an array and we want it as one string
  reason = reason.join(' ');
  
  // if they haven't said what the reason is then we just make it /shrug because /shrug
  if (!reason) reason = "/shrug";
  
  // we want to check if the user is bannable before we try so we don't get any errors
  // the only reasons i know is they have a role above the bots
  if (!message.guild.member(user).bannable) return message.channel.send(':negative_squared_cross_mark: I cannot ban that member, their role might be higher than mine');
  
  // so we are going to ban them and delete there message from the last 2 days
  message.guild.ban(user, 2);
  
  // now we load the servers settings
  const settings = client.settings.get(message.guild.id);
  
  // if they have turned on modlogs in the settings then we continue if not we return
  if (settings.modlogEnable !== "true") return;
  
  // we are loading what they have set as the modlog channel so we can send the log
  let modlog = client.channels.find("name", settings.modlogChannel);
  
  // if the channel doesn't exist then we return an error saying so that they can change the channel in the settings or turn off modlog
  if (!modlog) return message.channel.send(`:negative_squared_cross_mark: I couldn't find a modlog channel by the name of \`${settings.modlogChannel}\``);
  
  // now we make the embed for the log
  const banEmbed = new Discord.RichEmbed()
  
    // we want the colour to be whatever is in the server settings
    .setColor(settings.embedColour)
  
    // we set the thumbnail as the person that was banned's avatar
    .setThumbnail(user.avatarURL)
    
    // we want the time at the bottom so we know when they were banned
    .setTimestamp()
  
    // now we have a field with all the infomation in it
    // first we have the person that was banned's username, discriminator and id just so we don't mix people up
    // then we show the person the banned them
    // lastly the reason. if they did't set a reason then it is /shrug
    .addField('Action: ban', `User: ${user.username}#${user.discriminator} (${user.id})\nModrator: ${message.author.username}#${message.author.discriminator} (${message.author.id})\nReason: ${reason}`);
  
  // now we just send the embed to the modlog channel
  return client.channels.find("name", settings.modlogChannel).send({embed: banEmbed});
};

exports.cmdConfig = {
  name: "ban",
  // i really like this aliase
  aliases: ['vac'],
  description: "Bans the mentioned user and deletes their messages from the last 2 days. Permission needed: BAN_MEMBERS.",
  usage: "Ban <@user> [reason]",
  type: "mod"
};
