const Discord = require('discord.js');
const request = require('request');

exports.run = (client, message, waifu) => {
  if (!waifu[0]) return message.channel.send(':negative_squared_cross_mark: You must tell me who your waifu is');
  waifu = waifu.join(' ');
  waifu = waifu.toLowerCase();
  const settings = client.settings.get(message.guild.id);
  let score = client.randomNum(4, 10);
  if (waifu === "blake" || waifu === "blake belladonna") score = 10;
  let url = `https://api.qwant.com/api/search/images?count=1&offset=1&q=anime ` + waifu;
  request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode);
      } else {
        let resultArray = data.data.result.items;
        if (resultArray.length > 0)  {
          var image = data.data.result.items[0].media;
        }
      }
    const waifuEmbed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .addField(waifu.toProperCase(), `${score} / 10`);
    if (image !== undefined) waifuEmbed.setImage(image);
    message.channel.send({embed: waifuEmbed});
  });
};

exports.cmdConfig = {
  name: "ratemywaifu",
  aliases: ['waifu', 'ratemyhusbando', 'husbando'],
  description: "Gives your waifu a score out of 10.",
  usage: "ratemywaifu <waifu>",
  type: "fun"
};
