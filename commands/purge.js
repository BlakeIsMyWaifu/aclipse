exports.run = function(client, message, args) {
  let manageMessages = message.member.hasPermission("MANAGE_MESSAGES");
  if (manageMessages === false) return message.channel.send(':negative_squared_cross_mark: You do not have permission. You need \`MANAGE_MESSAGES\`');
  const user = message.mentions.users.first();
  const amount = !!parseInt(args[0]) ? parseInt(args[0]) : parseInt(args[1]);
  if (!amount) return message.channel.send(':negative_squared_cross_mark: Must specify an amount to delete!');
  if (!amount && !user) return message.channel.send(':negative_squared_cross_mark: Must specify a user and amount, or just an amount, of messages to purge!');
  message.channel.fetchMessages({
   limit: amount,
  }).then((messages) => {
    if (user) {
      const filterBy = user ? user.id : client.user.id;
      messages = messages.filter(m => m.author.id === filterBy).array().slice(0, amount);
    }
    message.channel.bulkDelete(messages);
  });
};

exports.cmdConfig = {
  name: "purge",
  aliases: ['p'],
  description: "Purges X amount of messages from a given channel. If no given amount of messages to delete, it will delete 20.",
  usage: "<number>",
  type: "mod",
  permission: "MANAGE_MESSAGES"
};
