const Discord = require('discord.js');
const request = require('request');
const moment = require('moment');
const md5 = require('md5');
const { inspect } = require("util");
exports.run = async (client, message, [search, ...args]) => {
  if (search) search = search.toLowerCase();
  var cmdList = [];
  var cmdArray = [
    ["player", "<player>", "Displays a players stats", "Who would you like me to look up?"],
    ["mastery", "<player> [number]", "Displays a players highest masteried Gods", "Who would you like me to look up?"],
    ["god", "<god>", "Displays infomation on a chosen God", "Which God would you like me to look up?"],
    ["ability", "<god> <ability number>", "Displays the God ability", "Which God would you like me to look up?"],
    ["item", "<item | term>", "not sure yet", "Which item would you like me to look up?"],
    ["friends", "<player>", "Lists all of there friends without private profiles", "Who would you like me to look up?"]
  ];
  const settings = client.settings.get(message.guild.id);
  const helpEmbed = new Discord.RichEmbed()
    .setColor(settings.embedColour)
    .setTitle('**Smite Help**');
  for (let [cmdName, cmdUsage, cmdDesc, cmdError] of cmdArray) {
    cmdList.push(cmdName);
    helpEmbed.addField(cmdName, `${settings.prefix}smite ${cmdName} ${cmdUsage}\n${cmdDesc}`);
  }
  if (search === "help" || search === undefined) {
    return message.channel.send({embed: helpEmbed});
  }
  var aliaseObj = {
    "masteries": "mastery",
    "gods": "god",
    "items": "item"
  };
  var aliaseArray = Object.keys(aliaseObj);
  if (!args[0]) {
    for (let [cmdName, cmdUsage, cmdDesc, cmdError] of cmdArray) {
      if (search === cmdName) return message.channel.send(`:negative_squared_cross_mark: ${cmdError}`);
    }
  }
  if (client.isInArray(aliaseArray, search) === true) search = aliaseObj[search];
  if (client.isInArray(cmdList, search) === false) return message.channel.send(':negative_squared_cross_mark: Unknown command');
  const domain = "http://api.smitegame.com/smiteapi.svc/";
  const devID = process.env.SMITEDEVID;
  let timestamp = moment().format('YYYYMMDDHHmmss');
  const authKey = process.env.SMITEAUTHID;
  function createSignature(method) {
    return md5(`${devID}${method}${authKey}${timestamp}`);
  }
  var rankedTierObj = {
    "Unranked": "#ff0000",
    "Bronze V": "#a0460a",
    "Bronze IV": "#a0460a",
    "Bronze III": "#a0460a",
    "Bronze II": "#a0460a",
    "Bronze I": "#a0460a",
    "Silver V": "#a0a0a0",
    "Silver IV": "#a0a0a0",
    "Silver III": "#a0a0a0",
    "Silver II": "#a0a0a0",
    "Silver I": "#a0a0a0",
    "Gold V": "#dca032",
    "Gold IV": "#dca032",
    "Gold III": "#dca032",
    "Gold II": "#dca032",
    "Gold I": "#dca032",
    "Platinum V": "#508c28",
    "Platinum IV": "#508c28",
    "Platinum III": "#508c28",
    "Platinum II": "#508c28",
    "Platinum I": "#508c28",
    "Diamond V": "#2864c8",
    "Diamond IV": "#2864c8",
    "Diamond III": "#2864c8",
    "Diamond II": "#2864c8",
    "Diamond I": "#2864c8",
    "Masters": "#ff00ff"
  };
  var rankedTierArray = Object.keys(rankedTierObj);
  var roleObj = {
    "assassin": "#ffff00",
    "guardian": "#14ff00",
    "hunter": "#ff6400",
    "mage": "#ff00ff",
    "warrior": "#ff0000"
  };
  var itemObj = {
    "starter": ["StartingItem", true],
    "tier 1": ["ItemTier", 1, "StartingItem", false, "Type", "Item"],
    "tier 2": ["ItemTier", 2, "Type", "Item"],
    "tier 3": ["ItemTier", 3],
    "physical power": ["Physical Power"],
    "magical power": ["Magical Power"],
    "attack speed": ["Attack Speed"],
    "physical lifesteal": ["Physical Lifesteal"],
    "magical lifesteal": ["Magical Lifesteal"],
    "physical penetration": ["Physical Penetration"],
    "magical penetration": ["Magical Penetration"],
    "crit": ["Critical Strike Chance"],
    "crit chance": ["Critical Strike Chance"],
    "physical protection": ["Physical Protection"],
    "magical protection": ["Magical Protection"],
    "health": ["Health"],
    "ccr": ["Crowd Control Reduction"],
    "crowd control reduction": ["Crowd Control Reduction"],
    "hp5": ["HP5"],
    "health per 5": ["HP5"],
    "health per five": ["HP5"],
    "movement": ["Movement Speed"],
    "movement speed": ["Movement Speed"],
    "cooldown": ["Cooldown Reduction"],
    "cooldown %": ["Cooldown Reduction"],
    "cool down": ["Cooldown Reduction"],
    "mana": ["Mana"],
    "mana per 5": ["MP5"],
    "mana per five": ["MP5"],
    "relic": ["Type", "Active", "ItemTier", 2],
    "relics": ["Type", "Active", "ItemTier", 2],
    "consumable": ["Type", "Consumable"],
    "consumables": ["Type", "Consumable"]
  };
  var itemArray = Object.keys(itemObj);
  const testSession = async () => {
    var signature = createSignature("testsession");
    request.get({
      url: domain + `testsessionJson/${devID}/${signature}/${client.session.get("sessionID")}/${timestamp}`,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error:' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status:' + res.statusCode);
      } else {
        let message = data.split(' ');
        message = message[0] + message[1] + message[2];
        if (message === "Invalidsessionid.") {
          createSession();
        } else if (message === "Invalidsignature.Your") {
          return message.channel.send(':negative_squared_cross_mark: Invaid signature? If this error pops up the bot is really broken. Lets hope i never have to read this again!');
        } else if (message === "Thiswasa") {
        }
      }
    });
  };
  const createSession = async () => {
    var signature = createSignature("createsession");
    request.get({
      url: domain + `createsessionJson/${devID}/${signature}/${timestamp}`,
      json: true,
      headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error:' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status:' + res.statusCode);
      } else {
        client.session.set("sessionID", data.session_id);
      }
    });
  };
  const requestData = (method, parameters) => {
    var signature = createSignature(method);
    let url = domain + `${method}Json/${devID}/${signature}/${client.session.get("sessionID")}/${timestamp}/${parameters}`;
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
        if (search === "player") {
          if (!data[0]) return message.channel.send(`:negative_squared_cross_mark: I could not find that player. Either \`${args[0]}\` is wrong or the profile is private`);
          var p = data[0];
          if (p["Name"].startsWith('[') === true) {
            var name = p["Name"].replace('[', '').split(']');
            var clan = `[${name[0]}] ${p.Team_Name}`;
            name = name[1];
          } else {
            var name = p.Name;
            var clan = 'Not in a clan';
          }
          let main = [
            `**Level:** ${p.Level}`,
            `**Status:** ${p.Personal_Status_Message}`,
            `**Clan:** ${clan}`,
            `**Region:** ${p.Region}`,
            `**Mastery:** ${p.MasteryLevel} Gods, ${p.Total_Worshippers} total Worshippers`,
            `**Account Created:** ${p.Created_Datetime}`,
            `**Last Login:** ${p.Last_Login_Datetime}`,
            `**Achievements:** ${p.Total_Achievements}`
          ];
          let winrate = [
            `**Winrate:** ${parseInt(p.Wins) / (parseInt(p.Wins) + parseInt(p.Losses)) * 100}%`,
            `**Wins:** ${p.Wins}`,
            `**Losses:** ${p.Losses}`,
            `**Matches Left:** ${p.Leaves}`
          ];
          let ranked = [
            `**Conquest:** ${rankedTierArray[p.Tier_Conquest]}`,
            `**Duel:** ${rankedTierArray[p.Tier_Duel]}`,
            `**Joust:** ${rankedTierArray[p.Tier_Joust]}`
          ];
          let rankColour = [p.Tier_Conquest, p.Tier_Duel, p.Tier_Joust];
          rankColour = rankedTierObj[rankedTierArray[Math.max.apply(Math, rankColour)]];
          const playerEmbed = new Discord.RichEmbed()
            .setColor(rankColour)
            .setThumbnail(p.Avatar_URL)
            .addField(name, main.join('\n'))
            .addField('Games', winrate.join('\n'))
            .addField('Ranked', ranked.join('\n'));
          return message.channel.send({embed: playerEmbed});
        } else if (search === "mastery") {
          let s = "s";
          if (args[0].substr(args[0].length - 1) === "s") s = "";
          const masteryEmbed = new Discord.RichEmbed()
            .setColor(settings.embedColour)
            .setTitle(`${args[0]}'${s} Masteries`);
          let number = args[1];
          if (!args[1]) number = 5;
          if (number > 19) number = 20;
        } else if (search === "god") {
          const findGod = (searchGod) => {
            return searchGod["Name"].toLowerCase() === args.join(' ').toLowerCase();
          }
          var g = data.find(findGod);
          if (!g) return message.channel.send(`:negative_squared_cross_mark: \`${args.join(' ')}\` is not a God`);
          let main = [
            `**Role:**${g.Roles}`,
            `**Pantheon:** ${g.Pantheon}`,
            `**Attack Type:**${g.Type}`,
            `**Pros:**${g.Pros}`
          ];
          if (g.OnFreeRotation === "true") {
            main.push(`**Free Rotation:** Yes`);
          } else {
            main.push(`**Free Rotation:** No`);
          }
          if (g.latestGod === "y") main.push(`Currently the newest God`);
          let abilities = [
            `**P:** ${g.Ability1}`,
            `**1:** ${g.Ability2}`,
            `**2:** ${g.Ability3}`,
            `**3:** ${g.Ability4}`,
            `**4:** ${g.Ability5}`
          ];
          let stats = [
            [`**Attack Speed:** ${g.AttackSpeed}`, g.AttackSpeedPerLevel],
            [`**Health:** ${g.Health}`, g.HealthPerLevel],
            [`**HP5:** ${g.HealthPerFive}`, g.HP5PerLevel],
            [`**Mana:** ${g.Mana}`, g.ManaPerLevel],
            [`**MP5:** ${g.ManaPerFive}`, g.MP5PerLevel],
            [`**Magical Protection:** ${g.MagicProtection}`, g.MagicProtectionPerLevel],
            [`**Physical Protection:** ${g.PhysicalProtection}`, g.PhysicalProtectionPerLevel]
          ];
          if (g.MagicalPower === 0) {
            stats.unshift([`**Physical Power:** ${g.PhysicalPower}`, g.PhysicalPowerPerLevel]);
          } else {
            stats.unshift([`**Magical Power:** ${g.MagicalPower}`, g.MagicalPowerPerLevel]);
          }
          let basicDamage = g.basicAttack.itemDescription.menuitems[0].value;
          basicDamage = basicDamage.replace('/', ' ').split(' ');
          stats.push([`**Basic Damage:** ${basicDamage[0]} ${basicDamage[4].replace('(', '')}`, basicDamage[2]]);
          let baseStats = [];
          let perLevel = [];
          for (let [base, level] of stats) {
            baseStats.push(base);
            perLevel.push(level);
          }
          const godEmbed = new Discord.RichEmbed()
            .setColor(roleObj[g["Roles"].replace(' ', '').toLowerCase()])
            .setThumbnail(g.godIcon_URL)
            .addField(`${g.Name} - ${g.Title}`, main.join('\n'))
            .addField('Abilities', abilities.join('\n'))
            .addField("Base Stats", baseStats.join('\n'), true)
            .addField("Per level", perLevel.join('\n'), true);
          return message.channel.send({embed: godEmbed});
        } else if (search === "ability") {
          return message.channel.send('WIP');
        } else if (search === "item") {
          if (args.join(' ').toLowerCase() === "fatalis") return message.channel.send('aids');
          if (client.isInArray(itemArray, args.join(' ')) === true) {
            var filterItemArray = [];
              for (const item of data) {
                if (itemObj[args.join(' ')].length === 1) {
                  item.ItemDescription["Menuitems"].forEach(function(stat) {
                    if (stat.Description === itemObj[args.join(' ')][0]) filterItemArray.push(item.DeviceName);
                  });
                } else if (itemObj[args.join(' ')].length === 2) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1]) filterItemArray.push(item.DeviceName);
                } else if (itemObj[args.join(' ')].length === 4) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1] && item[itemObj[args.join(' ')][2]] === itemObj[args.join(' ')][3]) filterItemArray.push(item.DeviceName);
                } else if (itemObj[args.join(' ')].length === 6) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1] && item[itemObj[args.join(' ')][2]] === itemObj[args.join(' ')][3] && item[itemObj[args.join(' ')][4]] === itemObj[args.join(' ')][5]) filterItemArray.push(item.DeviceName);
                }
              }
            return message.channel.send(`**[${filterItemArray.length}] ${args.join(' ').toProperCase()}:**\n` + filterItemArray.sort().join(', '));
          } else {
            const findItemByName = (searchItem) => {
              return searchItem["DeviceName"].toLowerCase() === args.join(' ').toLowerCase();
            };
            var i = data.find(findItemByName);
            if (!i) return message.channel.send(`:negative_squared_cross_mark: \`${args.join(' ')}\` is not an item or a searchable term`);
            if (i.Type === "Item") {
              let stats = [];
              for (let stat of i.ItemDescription.Menuitems) {
                stats.push(`${stat.Value} ${stat.Description}`);
              }
              let main = [
                `**Stats:**\n${stats.join('\n')}`
              ];
              var child = client.searchArrayOfObjects(data, "ItemId", i.ChildItemId);
              var root = client.searchArrayOfObjects(data, "ItemId", i.RootItemId);
              if (i.StartingItem) {
                main.unshift(`**Item Tier:** Starter`);
                main.unshift(`**Price:** ${i.Price}`);
              } else {
                main.unshift(`**Item Tier:** ${i.ItemTier}`);
                if (i.ItemTier === 1) {
                  main.unshift(`**Price:** ${i.Price}`);
                } else if (i.ItemTier === 2) {
                  main.unshift(`**Price:** ${i.Price} (${child.Price})`);
                } else if (i.ItemTier === 3) {
                  main.unshift(`**Price:** ${i.Price} (${parseInt(child.Price) + parseInt(root.Price)})`);
                }
              }
              if (i.ItemDescription.SecondaryDescription !== "" && i.ItemDescription.SecondaryDescription !== null) {
                main.unshift(`**Effect:** ${i.ItemDescription.SecondaryDescription}`);
              } else if (i.ItemDescription.Description !== "" && i.ItemDescription.Description !== null) {
                main.unshift(`**Effect:** ${i.ItemDescription.Description}`);
              } else if (i.ShortDesc !== "" && i.ShortDesc !== null) {
                main.unshift(`**Effect:** ${i.ShortDesc}`);
              }
              const itemEmbed = new Discord.RichEmbed()
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, main.join('\n'));
              let colour;
              i.ItemDescription["Menuitems"].forEach(function(stat) {
                if (stat["Description"].split(' ').includes("Physical")) {
                  colour = '#ff0000';
                } else if (stat["Description"].split(' ').includes("Magical")) {
                  colour = '#0050ff';
                }
                if (!colour) colour = '#ff00ff';
                itemEmbed.setColor(colour)
              });
              return message.channel.send({embed: itemEmbed});
            } else if (i.Type === "Active") {
              let desc = i.ItemDescription["SecondaryDescription"].replace("<font color='#FFFF00'>", '').replace("</font>", '').split(' Cooldown - ');
              const relicEmbed = new Discord.RichEmbed()
                .setColor('#14ff00')
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, `**Effect:** ${desc[0]}\n**Cooldown:** ${desc[1]}`);
              return message.channel.send({embed: relicEmbed});
            } else if (i.Type === "Consumable") {
              const consumableEmbed = new Discord.RichEmbed()
                .setColor('#ff6400')
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, `**Effect:** ${i.ItemDescription.SecondaryDescription}\n**Cost:** ${i.Price}`);
              return message.channel.send({embed: consumableEmbed});
            }
          }
/*
    Friends
*/
        } else if (search === "friends") {
          var f = data;
          if (!f) return message.channel.send(`:negative_squared_cross_mark: I could not find that player. Either \`${args[0]}\` is wrong or the profile is private`);
          let friendsArray = [];
          for (let name of f) {
            if (name.name !== "") friendsArray.push(name.name)
          }
          return message.channel.send(`== ${args[0]} ==\n[Total Friends - ${f.length}]\n\n${friendsArray.join(', ')}`, {code: "asciidoc"});
        }
      }
    });
  }
  testSession();
  await client.wait(1000);
  if (search === "player") {
    requestData("getplayer", args[0]);
  } else if (search === "mastery") {
    requestData("getgodranks", args[0]);
  } else if (search === "god" || search === "ability") {
    requestData("getgods", "1");
  } else if (search === "item") {
    requestData("getitems", "1");
  } else if (search === "friends") {
    requestData("getfriends", args[0]);
  }
};

exports.cmdConfig = {
  name: "smite",
  aliases: ['smit'],
  description: "Work in progress",
  usage: "smite <command> [arguments]",
  type: "info"
};
