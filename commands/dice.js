// just going to get how many sides they want
exports.run = (client, message, sides) => {
  
  // if they haven't said how many they want then set it to 6
  if (!sides[0]) sides = 6;
  
  // we just return a random number between 1 and sides
  // we use a function in util/function.js
  return message.channel.send(`${client.randomNum(1, sides)}`);
};

exports.cmdConfig = {
  name: "dice",
  aliases: ['roll', 'rtd', 'rolldice'],
  description: "Rolls a dice.",
  usage: "dice [sides]",
  type: "fun"
};
