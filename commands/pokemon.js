const Discord = require('discord.js');
const moment = require('moment');
const Pokedex = require('pokedex-promise-v2');
const P = new Pokedex();

exports.run = (client, message, [search, ...args]) => {
  const settings = client.settings.get(message.guild.id);
  search = search ? search.toLowerCase() : "help";
  var cmdObj = {
    "help": {
      "name": "help",
      "aliase": ["h"],
      "usage": "",
      "desc": "Displayes all pokemon commands and how to use them",
      "args": null,
      "hidden": false,
      "func": function () {
        const helpEmbed = new Discord.RichEmbed()
          .setColor(settings.embedColour)
          .setTitle('**Pokemon Help**');
        for (let cmd of cmdArray) {
          if (cmdObj[cmd]["hidden"] === false) helpEmbed.addField(cmdObj[cmd]["name"].toProperCase(), `${settings.prefix}pokemon ${cmdObj[cmd].name} ${cmdObj[cmd].usage}\n${cmdObj[cmd].desc}`);
        }
        return message.channel.send({embed: helpEmbed});
      }
    },
    "pokemon": {
      "name": "pokemon",
      "aliase": ['p', 'poke'],
      "usage": "<pokemon|id>",
      "desc": "Displayes stuff and things about a pokemon",
      "args": "Which Pokemon would you like me to search up for you?",
      "hidden": false,
      "func": function () {
        P.getPokemonByName(args.join(' '), function(p, err) {
          if (!err) {
            P.getPokemonSpeciesByName(args.join(' '), function(ps, err) {
              if (!err) {
                const pokemonEmbed = new Discord.RichEmbed();
                var pokemonColoursObj = {
                  black: '#000000',
                  blue: '#0000FF',
                  brown: '#A52A2A',
                  gray: '#808080',
                  green: '#008000',
                  pink: '#FFC0CB',
                  purple: '#800080',
                  red: '#FF0000',
                  white: '#FFFFFF',
                  yellow: '#FFFF00'
                };
                pokemonEmbed.setColor(pokemonColoursObj[ps.color.name]);
                let thumbnailNumber = client.randomNum(1, 20);
                let thumbnail = thumbnailNumber === 20 ? p.sprites.front_shiny : p.sprites.front_default;
                pokemonEmbed.setThumbnail(thumbnail);
                let pokemonType = p['types'].length === 1 ? [p.types[0].type.name.toProperCase(), ''] : [`${p.types[1].type.name.toProperCase()} + ${p.types[0].type.name.toProperCase()}`, 's'];
                let eggGroup = [];
                for (let eg of ps.egg_groups) {
                  eggGroup.push(eg.name.toProperCase());
                }

                let pokemonInfo = [
                  `**ID:** ${p.id}`,
                  `**Type${pokemonType[1]}:** ${pokemonType[0]}`,
                  `**Moves:** ${p['moves'].length}`,
                  `**Capture Rate:** ${ps.capture_rate} / 255`,
                  `**Habitat:** ${ps.habitat === null ? 'none' : ps.habitat.name.toProperCase()}`,
                  `**Shape:** ${ps.shape.name.toProperCase()}`,
                  `**Egg Group:** ${eggGroup.join(' + ')}`,
                  `**Base Happiness:** ${ps.base_happiness}`,
                  `**Generation:** ${ps.generation.name.replace('generation-', '').toUpperCase()}`,
                  `**Flavor Text:** ${ps.flavor_text_entries.find(findEn).flavor_text.replace(/\n/g, '')}`,
                  `**Growth Rate:** ${ps.growth_rate.name.toProperCase()}`,
                  `**Hatch Counter:** ${(parseInt(ps.hatch_counter) + 1) * 255} steps`,
                  `**Genera:** ${ps.genera.find(findEn).genus}`
                ];
                pokemonEmbed.addField(p.name.toProperCase(), pokemonInfo.join('\n'));
                let pokemonStats = [
                  `**HP:** ${p.stats[5].base_stat} ${p.stats[5].effort !== 0 ? `(${p.stats[5].effort} EV)` : ''}`,
                  `**Atk:** ${p.stats[4].base_stat} ${p.stats[4].effort !== 0 ? `(${p.stats[4].effort} EV)` : ''}`,
                  `**Def:** ${p.stats[3].base_stat} ${p.stats[3].effort !== 0 ? `(${p.stats[3].effort} EV)` : ''}`,
                  `**Spec Atk:** ${p.stats[2].base_stat} ${p.stats[2].effort !== 0 ? `(${p.stats[2].effort} EV)` : ''}`,
                  `**Spec Def:** ${p.stats[1].base_stat} ${p.stats[1].effort !== 0 ? `(${p.stats[1].effort} EV)` : ''}`,
                  `**Spd:** ${p.stats[0].base_stat} ${p.stats[0].effort !== 0 ? `(${p.stats[0].effort} EV)` : ''}`
                ];
                pokemonEmbed.addField('Stats', pokemonStats.join('\n'));
                let pokemonAbilities = [];
                for (let a of p.abilities) {
                  let abl = a.ability.name.toProperCase();
                  if (a.is_hidden === true) abl += ' (Hidden)';
                  pokemonAbilities.push(abl);
                }
                pokemonEmbed.addField('Abilties', pokemonAbilities.join('\n'));
                return message.channel.send({embed: pokemonEmbed});
              }
            });
          } else {
            return message.channel.send(`:negative_squared_cross_mark: Cannot find pokemon \`${args.join(' ')}\``);
          }
        });
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
  cmdObj[search].func();
  function findEn(array) {
    return array.language.name === 'en';
  };
};

exports.cmdConfig = {
  name: "pokemon",
  aliases: ['poke'],
  description: "POKEMON",
  usage: "<command> [arguments]",
  type: "game",
  permission: null
};
