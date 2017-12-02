exports.run = (client, message, args) => {
  let user = message.mentions.users.first() || message.author;
  if (user.avatarURL === null) return message.channel.send(`:negative_squared_cross_mark: \`${user.username}\` does not have an avatar`);
  let s = "s";
  if (user.username.substr(user.username.length - 1) === "s") s = "";
  return message.channel.send(`**${user.username}'${s}** avatar URL: ${user.avatarURL}`);
};

exports.cmdConfig = {
  name: "avatar",
  aliases: ['ava'],
  description: "Displays a users avatar.",
  usage: "avatar [@user]",
  type: "info"
};
