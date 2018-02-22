const request = require('request');
const meme = require('../data/memes.json');

exports.run = (client, message, args) => {
  var list = Object.keys(meme.inbuild).sort();
  if (args[0] === "list") {
    list = client.chunkArray(list, 25);
    let pageNumber = args[1] ? (/^\d+$/.test(args[1]) ? (args[1] > list.length ? list.length : (args[1] === "0" ? 1 : args[1])) : 1) : 1;
    return message.channel.send(`**Page Number ${pageNumber} of ${list.length}**\n${list[pageNumber - 1].join(', ')}`);
  }
  list = list.join('-=_++').toLowerCase().split('-=_++');
  args = args.join(' ').split('|');
  if (client.isInArray(list, args[0].toLowerCase().trim()) === false) return message.channel.send(':negative_squared_cross_mark: Error: meme not found');
  args[1] = !args[1] ? "_" : args[1];
  args[2] = !args[2] ? "_" : args[2];
  let url = `https://memegen.link/${args[0]}/${args[1]}/${args[2]}`;
  request.get({
    url: url,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
    } else if (res.statusCode !== 200) {
      return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
    } else {
      return message.channel.send({'files': [data.direct.visible]});
    }
  });
};

exports.cmdConfig = {
  name: "memes",
  aliases: ['meme'],
  description: "Makes a memes.",
  usage: "list || [<meme> | [top line] | [bottom line]]",
  type: "fun",
  permission: null
};
