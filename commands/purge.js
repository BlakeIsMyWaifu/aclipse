exports.run = function(client, message, args) {
  let manageMessages = message.member.hasPermission("MANAGE_MESSAGES");
  if (manageMessages === false) return message.channel.send(':negative_squared_cross_mark: You do not have permission. You need \`MANAGE_MESSAGES\`');
  let messageCount = parseInt(args);
  if (isNaN(messageCount) && messageCount) return message.channel.send(`:negative_squared_cross_mark: ${messageCount} is not a number`);
  if (!messageCount) {
    message.channel.bulkDelete(20);
  } else if (messageCount <= 50 || messageCount >= 2) {
    message.channel.fetchMessages({
      limit: messageCount
    }).then(messages => message.channel.bulkDelete(messages));
  } else if (messageCount < 51) {
    return message.channel.sendMessage(`:negative_squared_cross_mark: ${messageCount} is too big (max is 50)`);
  } else if (messageCount > 3) {
    return message.channel.sendMessage(`:negative_squared_cross_mark: ${messageCount} is too small (minium is 2)`);
  }
};

exports.cmdConfig = {
  name: "purge",
  aliases: ['p'],
  description: "Purges X amount of messages from a given channel. If no given amount of messages to delete, it will delete 20. Permission needed: MANAGE_MESSAGES.",
  usage: "purge [number]",
  type: "mod"
};
