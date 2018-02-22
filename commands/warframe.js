const Discord = require('discord.js');
const request = require("request");
const moment = require('moment');

exports.run = (client, message, [search, ...args]) => {
  const settings = client.settings.get(message.guild.id);
  search = search ? search.toLowerCase() : "help";
  const wfEmbed = (time) => {
    const embed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setFooter(`Time: ${moment.unix(time)}`);
    return embed;
  }
  var cmdObj = {
    "active": {
      "name": "",
      "aliase": [],
      "usage": "",
      "desc": "",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
        
      }
    },
    "alerts": {
      "name": "alerts",
      "aliase": [],
      "usage": "",
      "desc": "Displayes the current alerts",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
        let timeNow = moment();
        data.Alerts.forEach(function(a) {
          let endTime = moment.unix(parseInt(a.Date.$date.$numberLong) / 1000);
          embed.addField()
        })
        return message.channel.send({embed: embed});
      }
    },
    "events": {
      "name": "events",
      "aliase": ['event'],
      "usage": "",
      "desc": "Displayes the latest events",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
        let events = [];
        let timeNow = moment();
        data.Events.forEach(function(e) {
          let eventTime = moment.unix(parseInt(e.Date.$date.$numberLong) / 1000);
          events.push(`**[${timeNow.diff(eventTime, 'days')}d]** ${e.Messages[0].Message}`);
        });
        events.reverse();
        embed.addField('Events', events.join('\n'));
        return message.channel.send({embed: embed});
      }
    },
    "help": {
      "name": "help",
      "aliase": ["h"],
      "usage": "",
      "desc": "Displayes all warframe commands and how to use them",
      "args": null,
      "hidden": false,
      "func": function () {
        const helpEmbed = new Discord.RichEmbed()
          .setColor(settings.embedColour)
          .setTitle('**Warframe Help**');
        for (let cmd of cmdArray) {
          if (cmdObj[cmd]["hidden"] === false) helpEmbed.addField(cmdObj[cmd]["name"].toProperCase(), `${settings.prefix}warframe ${cmdObj[cmd].name} ${cmdObj[cmd].usage}\n${cmdObj[cmd].desc}`);
        }
        return message.channel.send({embed: helpEmbed});
      }
    },
    "invasion": {
      "name": "",
      "aliase": [],
      "usage": "",
      "desc": "",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
        
      }
    },
    "sale": {
      "name": "",
      "aliase": [],
      "usage": "",
      "desc": "",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
      
      }
    },
    "sortie": {
      "name": "sortie",
      "aliase": [],
      "usage": "",
      "desc": "",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {

      }
    },
    "syndicate": {
      "name": "",
      "aliase": [],
      "usage": "",
      "desc": "",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
      
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
  requestData();
  function requestData() {
    request.get({
      url: "http://content.warframe.com/dynamic/worldState.php",
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
      } else {
        cmdObj[search].func(data, wfEmbed(data.Time));
      }
    });
  }
};

exports.cmdConfig = {
  name: "warframe",
  aliases: ['wf'],
  description: "WARFRAME",
  usage: "<command> [arguments]",
  type: "game",
  permission: null
};
