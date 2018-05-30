const Discord = require('discord.js');
const request = require("request");
const iso = require('iso-3166-2');

exports.run = (client, message, [search, ...args]) => {
  const settings = client.settings.get(message.guild.id);
  search = search ? search.toLowerCase() : "help";
  var cmdObj = {
    "help": {
      "name": "help",
      "aliase": ['h'],
      "usage": "",
      "desc": "Displayes all warframe commands and how to use them",
      "args": null,
      "hidden": false,
      "api": [false],
      "func": function () {
        const helpEmbed = new Discord.RichEmbed()
          .setColor(settings.embedColour)
          .setTitle('**osu Help**');
        for (let cmd of cmdArray) {
          if (cmdObj[cmd]["hidden"] === false) helpEmbed.addField(cmdObj[cmd]["name"].toProperCase(), `${settings.prefix}osu ${cmdObj[cmd].name} ${cmdObj[cmd].usage}\n${cmdObj[cmd].desc}`);
        }
        return message.channel.send({embed: helpEmbed});
      }
    },
    "user": {
      "name": "user",
      "aliase": ['u', 'player', 'p'],
      "usage": "<username>",
      "desc": "Gets user info",
      "args": null,
      "hidden": false,
      "api": [true, 'get_user', `u=${args.join()}`],
      "func": function (data) {
        let u = data[0];
        let main = [
          `**Rank:** ${u.pp_rank}`,
          `**Country Rank:** ${u.pp_country_rank} (${iso.country(u.country).name}})`,
          `**PP:** ${u.pp_raw}`,
          `**Accuracy:** ${u.accuracy.toFixed(2)}`,
          `**Level:** ${u.level}`,
          `**Play Count:** ${u.playcount}`
        ];
        const userEmbed = new Discord.RichEmbed()
          .setColor(settings.embedColour)
          .setThumbnail(`http://s.ppy.sh/a/${u.user_id}`)
          .addField(u.username, main.join('\n'));
        return message.channel.send({embed: userEmbed});
      }
    }
  }
  var cmdArray = Object.keys(cmdObj);
  for (let cmd of cmdArray) {
    for (let i = 0; i < cmdObj[cmd]["aliase"].length; i++) {
      if (search === cmdObj[cmd].aliase[i]) search = cmd;
    }
  }
  if (client.isInArray(cmdArray, search) === false) return message.channel.send(':negative_squared_cross_mark: Unknown command');
  if (cmdObj[search].args !== null && !args[0]) return message.channel.send(cmdObj[search].args);
  if (cmdObj[search].api[0] === true) {
    requestData();
  } else {
    cmdObj[search].func();
  }
  function requestData() {
    let api = cmdObj[search].api.splice(0, 2);
    request.get({
      url: `https://osu.ppy.sh/api/${api[1]}?k=${process.env.OSU}&${cmdObj[search].api.join('&')}`,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
      } else {
        cmdObj[search].func(data);
      }
    });
  }
};

exports.cmdConfig = {
  name: "osu",
  aliases: ['o'],
  description: "OSU",
  usage: "<command> [arguments]",
  type: "game",
  permission: null
};
