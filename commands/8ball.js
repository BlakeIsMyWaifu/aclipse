// get the discord.js lib so that we can actually do stuff
const Discord = require('discord.js');

// no need to make it asynchronous
// the only argument we need is a question so we will name it that
exports.run = (client, message, question) => {
  
  // we want to check if they actually asked a question before we start doing sruff
  if (!question[0]) return message.channel.sendMessage(':negative_squared_cross_mark: You must ask a question');
  
  // here is where we have all the answers in an object so we can get the correct colour with them
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
  
  // we make the keys of the object into an array so we can pick on randomly
  let answerArray = Object.keys(answerObj);
  
  // this picks a random answer from the array
  let answer = answerArray[Math.floor(Math.random() * answerArray.length)];
  
  // this makes the embed
  const ballEmbed = new Discord.RichEmbed()
  
    // we want to set the colour according to what the response is
    .setColor(answerObj[answer])
  
    // we will make the title the embed what the question is
    // we make the other part the random answer
    .addField(`:question: ${question.join(' ')}`, `:8ball: ${answer}`);
  
  // now we just send the embed
  return message.channel.send({embed: ballEmbed});
};

exports.cmdConfig = {
  name: "8ball",
  aliases: ['8', 'magic8'],
  description: "A magic 8ball. Ask it any yes or no question and it will answer you. It never lies unless it lies.",
  usage: "8ball <question>",
  type: "fun"
};
