const request = require("request");
const convert = require('xml-js');

exports.run = (client, message, args) => {
  if (message.channel.name.startsWith('nsfw') === false) return message.channel.send(':negative_squared_cross_mark: This command must be done in a NSFW channel');
  if (!args[0]) return message.channel.send(':negative_squared_cross_mark: You must give me a term to search');
  if (/^\d+$/.test(args[args.length - 1])) {
    var offset = args[args.length - 1] < 100 ? (args[args.length - 1] > 0 ? args[args.length - 1] : 1) : 100;
    args.pop();
  } else if (args[args.length - 1] === "random") {
    var offset = client.randomNum(1, 100);
    args.pop();
  } else {
    var offset = 1;
  }
  request.get({
    url: `https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${args.join('_')}`,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
    } else if (res.statusCode !== 200) {
      return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
    } else {
      data = convert.xml2json(data);
      data = JSON.parse(data);
      if (data.elements[0].elements === undefined) return message.channel.send(':negative_squared_cross_mark: You are into some weird shit if there isn\'t even rule34 for it...');
      if (offset > data.elements[0]["elements"].length) offset = data.elements[0]["elements"].length;
      data = data.elements[0].elements[offset - 1].attributes;
      return message.channel.send(`**${args.join(' ').toProperCase()}** #${offset}`, {file: data.file_url});
    }
  });
};

exports.cmdConfig = {
  name: "rule34",
  aliases: ['r34'],
  description: "If you don't know then you don't know",
  usage: "<term>",
  type: "fun",
  permission: null
};
