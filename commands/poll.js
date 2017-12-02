exports.run = async (client, message, args) => {
  let reactionArray = ['👍', '👎', '🤷'];
  for (const react of reactionArray) {
    await message.react(react);
  }
};

exports.cmdConfig = {
  name: "poll",
  aliases: ['createpoll'],
  description: "Creates a poll that people can vote using reactions.",
  usage: "poll",
  type: "fun"
};