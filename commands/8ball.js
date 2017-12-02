const Discord = require('discord.js');

exports.run = (client, message, question) => {
  if (!question[0]) return message.channel.sendMessage(':negative_squared_cross_mark: You must ask a question');
  let answerObj = {
    "It is certain": "#00FF00",
    "It is decidedly so": "#00FF00",
    "Without a doubt": "#00FF00",
    "Yes definitely": "#00FF00",
    "You may rely on it": "#00FF00",
    "As i see it, yes": "#00FF00",
    "Most likely": "#00FF00",
    "Outlook good": "#00FF00",
    "Yes": "#00FF00",
    "Signs point to yes": "#00FF00",
    "Reply hazy try again": "#FFFF00",
    "Ask again later": "#FFFF00",
    "Better not tell you now": "#FFFF00",
    "Cannot predict now": "#FFFF00",
    "Concentrate and ask again": "#FFFF00",
    "Don't count on it": "#FF0000",
    "My reply is no": "#FF0000",
    "My source say no": "#FF0000",
    "Outlook not so good": "#FF0000",
    "Very doubtful": "#FF0000"
  };
  let answerArray = Object.keys(answerObj);
  let answer = answerArray[Math.floor(Math.random() * answerArray.length)];
  const ballEmbed = new Discord.RichEmbed()
    .setColor(answerObj[answer])
    .addField(`:question: ${question.join(' ')}`, `:8ball: ${answer}`);
  return message.channel.send({embed: ballEmbed});
};

exports.cmdConfig = {
  name: "8ball",
  aliases: ['8', 'magic8'],
  description: "A magic 8ball. Ask it any yes or no question and it will answer you. It never lies unless it lies.",
  usage: "8ball <question>",
  type: "fun"
};
