const Discord = require('discord.js');
const db = require('../data/waifu.json');
const request = require('request');
const md5 = require('md5');

exports.run = (client, message, waifu) => {
  if (!waifu[0]) return message.channel.send(':negative_squared_cross_mark: You must tell me who your waifu is');
  waifu = waifu.join(' ').toLowerCase();
  const settings = client.settings.get(message.guild.id);
  var score = md5(waifu.toLowerCase()).replace(/\D/g,'');
  score = 10 - parseInt(score.charAt(0));
  var waifus = Object.keys(db);
  if (client.isInArray(waifus, waifu)) {
    for (let w of db[waifu]) {
      if (Number.isInteger(w)) var score = w;
      if (typeof w === "string") var pic = w;
    }
    if (pic === undefined) {
      requestImage();
    } else {
      embed(pic);
    }
  } else {
    requestImage();
  }
  function requestImage() {
    var url = `https://api.qwant.com/api/search/images?count=1&offset=1&q=anime ` + waifu;
    request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        message.channel.send(':negative_squared_cross_mark: Error: ' + err);
        embed(null);
      } else if (res.statusCode !== 200) {
        message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
        embed(null);
      } else {
        var image = data.data.result["items"].length > 0 ? data.data.result.items[0].media : null;
        embed(image);
      }
    });
  }
  function embed(image) {
    const waifuEmbed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .addField(waifu.toProperCase(), `${score} / 10`);
    if (image !== null) waifuEmbed.setImage(image);
    return message.channel.send({embed: waifuEmbed});
  }
};

exports.cmdConfig = {
  name: "ratemywaifu",
  aliases: ['waifu', 'ratemyhusbando', 'husbando'],
  description: "Gives your waifu a score out of 10.",
  usage: "<waifu/husbando>",
  type: "fun",
  permission: null
};
