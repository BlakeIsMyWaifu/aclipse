const Discord = require("discord.js");
const request = require("request");

exports.run = (client, message, [search, ...args]) => {
  const apiKey = process.env.GIPHY;
  if (search === "help" || search === undefined) {
    var cmdArray = [
      ["search", "<term> [number]", "Gives a gif from a given term"],
      ["trending", "[number]", "Gives the trending gifs on Giphy"],
      ["random", "<term>", "Gives a random gif from a given term"]
    ];
    const settings = client.settings.get(message.guild.id);
    const helpEmbed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setTitle('**Gif Help**');
    for (let [cmdName, cmdUsage, cmdDesc] of cmdArray) {
       helpEmbed.addField(cmdName, `${settings.prefix}dashboard ${cmdName} ${cmdUsage}\n${cmdDesc}`);
    }
    return message.channel.send({embed: helpEmbed});
  } else if (search === "search") {
    if (!args[0]) return message.channel.send(':negative_squared_cross_mark: You must give me a term to search');
    var offset = args[args.length - 1];
    if (/^\d+$/.test(offset)) {
      args.pop();
      if (offset > 24) offset = 25;
    } else {
      offset = 1;
    }
    var q = args.join(' ');
    offset -= 1;
    var url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=25&offset=${offset}&rating=G&lang=en`;
  } else if (search === "trending") {
    var q = "Trending";
    if (/^\d+$/.test(args[0])) {
      var offset = args[0];
      if (offset > 24) offset = 25;
    } else {
      var offset = 1;
    }
    offset -= 1;
    var url = `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=25&rating=G`; 
  } else if (search === "random") {
    if (!args[0]) return message.channel.send(':negative_squared_cross_mark: You must give me a term to search');
    var q = args.join(' ');
    var url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${q}&rating=G`;
  }
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
      let title = `**${q.toProperCase()}**`;
      if (search === "search" || search === "trending") {
        var gif = data.data[offset].url
        let number = ` #${parseInt(offset) + 1}`;
        title += number;
      } else {
        var gif = data.data.url;
      }
      return message.channel.send(`${title}\n${gif}`);
    }
  });
};

exports.cmdConfig = {
  name: "gif",
  aliases: ['giphy'],
  description: "Searches giphy for a gif.",
  usage: "<command> [arguments]",
  type: "fun",
  permission: null
};
