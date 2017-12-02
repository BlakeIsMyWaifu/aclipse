const Discord = require('discord.js');
const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const querystring = require('querystring');

exports.run = async (client, message, args) => {
  args = args.join(' ');
  let searchMessage = await message.channel.send(`Search for \`${args}\` . . .`);
  let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(message.content)}`;
  snekfetch.get(searchUrl).then((result) => {
    let $ = cheerio.load(result.text);
    let googleData = $('.r').first().find('a').first().attr('href');
    googleData = querystring.parse(googleData.replace('/url?', ''));
    searchMessage.edit(`Result found for \`${args}\`\n\n${googleData.q}`);
  }).catch((err) => {
    searchMessage.edit(':negative_squared_cross_mark: No results found');
  });
};

exports.cmdConfig = {
  name: "google",
  aliases: [],
  description: "Googles.",
  usage: "google <question>",
  type: "info"
};
