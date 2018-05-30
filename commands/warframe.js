const Discord = require('discord.js');
const request = require("request");
const moment = require('moment');

exports.run = (client, message, [search, ...args]) => {
  const settings = client.settings.get(message.guild.id);
  search = search ? search.toLowerCase() : "help";
  var timeNow = moment();
  const wfEmbed = (time) => {
    const embed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setFooter(`Time: ${moment.unix(time)}`);
    return embed;
  }
  var cmdObj = {
    "active": {
      "name": "active",
      "aliase": [],
      "usage": "",
      "desc": "?",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {

      }
    },
    "alerts": {
      "name": "alerts",
      "aliase": ['alert'],
      "usage": "",
      "desc": "Displayes the current alerts",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {
        var sortData = function (prop, array) {
          prop = prop.split('.');
          var len = prop.length;
          array.sort(function(a, b) {
            var i = 0;
            while(i < len) {a = a[prop[i]]; b = b[prop[i]]; i++;}
            if (a < b) {
              return -1;
            } else if (a > b) {
              return 1;
            } else {
              return 0;
            }
          });
          return array;
        };
        let alerts = sortData('Activation.$date.$numberLong', data.Alerts);
        alerts.forEach(function(a) {
          let timeEnd = moment(parseInt(a.Expiry.$date.$numberLong));
          let r = [];
          if (a.MissionInfo.missionReward.hasOwnProperty('items') === true) {
            a.MissionInfo.missionReward.items.forEach(function(i) {
              r.push(i.split('/')[i.split('/').length - 1].camelToSpace());
            });
          } else if (a.MissionInfo.missionReward.hasOwnProperty('countedItems') === true) {
            a.MissionInfo.missionReward.countedItems.forEach(function(i) {
              r.push(i.ItemCount + ' ' + i.ItemType.split('/')[i.ItemType.split('/').length - 1].camelToSpace());
            });
          }
          let info = [
            `**Start Time:** ${moment(parseInt(a.Activation.$date.$numberLong)).format('h:mm')}`,
            `**End Time:** ${moment(parseInt(a.Expiry.$date.$numberLong)).format('h:mm')}`,
            `**Reward:** ${a.MissionInfo.missionReward.credits} Credits ${r.length === 0 ? '' : '+ '}${r}`,
            `**Type:** ${a.MissionInfo.missionType.replace('MT_', '').replace(/_/g, ' ').toProperCase()}`,
            `**Faction:** ${a.MissionInfo.faction.split('_')[1].toProperCase()}`,
            `**Location:** ${a.MissionInfo.location}`,
            `**Level Override:** ${a.MissionInfo.levelOverride.split('/')[a.MissionInfo['levelOverride'].split('/').length - 1].camelToSpace()}`
          ];
          embed.addField(`${moment(parseInt(a.Expiry.$date.$numberLong)).diff(timeNow, 'minutes')} Minutes (${a.MissionInfo.minEnemyLevel} - ${a.MissionInfo.maxEnemyLevel})`, info.join('\n'));
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
        data.Events.forEach(function(e) {
          events.push(`**[${timeNow.diff(moment(parseInt(e.Date.$date.$numberLong)), 'days')}d]** ${e.Messages[0].Message}`);
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
      "name": "invasion",
      "aliase": [],
      "usage": "",
      "desc": "?",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {

      }
    },
    "sale": {
      "name": "sale",
      "aliase": [],
      "usage": "",
      "desc": "?",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {

      }
    },
    "sortie": {
      "name": "sortie",
      "aliase": [],
      "usage": "",
      "desc": "?",
      "args": null,
      "hidden": false,
      "func": function (data, embed) {

      }
    },
    "syndicate": {
      "name": "syndicate",
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
