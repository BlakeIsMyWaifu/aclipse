const Discord = require('discord.js');
const yt = require('ytdl-core');
const request = require('request');
require('node-opus');

exports.run = async (client, message, [search, ...args]) => {
  var gid = message.guild.id;
  const settings = client.settings.get(gid);
  search = search ? search.toLowerCase() : "help";
  if (Object.keys(client.queue).length === 0) client.queue = {};
  console.log(client.queue);
  if (!client.queue.hasOwnProperty(gid)) {
    client.queue[gid] = {
      playing: false,
      leave: false,
      songs: []
    };
  }
  console.log(client.queue);
  var cmdObj = {
    "help": {
      "name": "help",
      "aliase": ["h"],
      "usage": "",
      "desc": "Displayes all music commands and how to use them",
      "args": null,
      "hidden": false,
      "func": function () {
        const helpEmbed = new Discord.RichEmbed()
          .setColor(settings.embedColour)
          .setTitle('**Music Help**');
        for (let cmd of cmdArray) {
          if (cmdObj[cmd]["hidden"] === false) helpEmbed.addField(cmdObj[cmd]["name"].toProperCase(), `${settings.prefix}music ${cmdObj[cmd].name} ${cmdObj[cmd].usage}\n${cmdObj[cmd].desc}`);
        }
        return message.channel.send({embed: helpEmbed});
      }
    },
    "add": {
      "name": "add",
      "aliase": ['a'],
      "usage": "",
      "desc": "?",
      "args": "url?",
      "hidden": false,
      "func": function () {
        if (!args[0]) return message.channel.send(':negative_squared_cross_mark: Which song would you like to play?');
        if (args[0].replace(/./g, '').startsWith('https://wwwyoutubecom/watch?v=')) {
          videoGet(args[0].replace(/./g, '').replace('https://wwwyoutubecom/watch?v=', ''))
        } else {
          request.get({
            url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&key=${process.env.YT}&q=${args.join(' ')}`,
            json: true,
            headers: {'User-Agent': 'request'}
          }, (err, res, data) => {
            if (err) {
              return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
            } else if (res.statusCode !== 200) {
              return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
            } else {
              videoGet(data.items[0].id.videoId);
            }
          });
        };
        function videoGet(videoId) {
          yt.getInfo(videoId, (err, info) => {
            if (err) return message.channel.send(`Invalid YouTube Link: ${err}`);
            client.queue[gid].songs.push({url: `https://www.youtube.com/watch?v=${videoId}`, title: info.title, requester: message.author.id});
            return message.channel.send(`:musical_note: Added **${info.title}** to the queue :musical_note:`);
          })
        }
      }
    },
    "clear": {
      "name": "clear",
      "aliase": ['c'],
      "usage": "",
      "desc": "Clears the whole queue",
      "args": null,
      "hidden": false,
      "func": function () {
        message.channel.send(`:musical_note: The queue has been cleared by \`${message.author.username}\`. **${client.queue[gid].songs.length}** songs have been removed!`).then(() => {
          client.queue[gid].songs = [];
        });
      }
    },
    "leave": {
      "name": "leave",
      "aliase": ['l'],
      "usage": "",
      "desc": "The bot leaves the voice chat if it is in one",
      "args": null,
      "hidden": false,
      "func": function () {
        if (!message.member.voiceChannel || message.member.voiceChannel.type !== 'voice') return message.channel.send(':negative_squared_cross_mark: I am not in a voice chat');
        return message.channel.send(':white_check_mark: I have left the voice chat').then(() => {
          client.queue[gid].playing = false;
          client.queue[gid].leave = true;
          message.member.voiceChannel.leave();
        });
      }
    },
    "play": {
      "name": "play",
      "aliase": ['p'],
      "usage": "",
      "desc": "Adds the bot to your current voice chat and plays the queue",
      "args": null,
      "hidden": false,
      "func": async function () {
        if (!message.guild.voiceConnection) {
          let vc = message.member.voiceChannel;
          if (!vc || vc.type !== 'voice') return message.channel.send(':negative_squared_cross_mark: I couldn\'t find your voice chat?');
          vc.join();
        }
        if (client.queue[gid].playing === true) return message.channel.send(`:negative_squared_cross_mark: Already playing in ${message.member.voiceChannel.name}`);
        if (client.queue[gid] === undefined || client.queue[gid].songs.length === 0) return message.channel.send(`:negative_squared_cross_mark: The queue is empty`);
        var dispatcher;
        client.queue[gid].playing = true;
        (function play(song) {
          if (client.queue[gid].leave === true) {
            client.queue[gid].leave = false;
            return;
          }
          if (song === undefined) {
            return message.channel.send(':stop_button: Queue is empty').then(() => {
              client.queue[gid].playing = false;
              message.member.voiceChannel.leave();
            });
          }
          message.channel.send(`:headphones: Playing: **${song.title}** as requested by: **${client.users.get(song.requester).username}**`);
          dispatcher = message.guild.voiceConnection.playStream(yt(song.url, {audioonly: true}), {passes: client.config.passes});
          dispatcher.on('end', () => {
            client.queue[gid].songs.shift();
            play(client.queue[gid].songs[0]);
          });
          dispatcher.on('error', (err) => message.channel.send(`:negative_squared_cross_mark: error: ${err}`).then(() => {
            client.queue[gid].soings.shift();
            play(client.queue[gid].songs[0]);
          }));
          return;
        }(client.queue[gid].songs[0]));
        return;
      }
    },
    "queue": {
      "name": "queue",
      "aliase": ['q'],
      "usage": "",
      "desc": "Views the current queue",
      "args": null,
      "hidden": false,
      "func": function () {
        if (client.queue[gid] === undefined) return message.channel.send(`:negative_squared_cross_mark: The queue is empty`);
        let q = client.queue[gid].songs.map((song, i) => `${i + 1}. ${song.title} - Requested by: ${client.users.get(song.requester).username}`);
        return message.channel.send([
          `:notepad_spiral: __**${message.guild.name}**__'s Queue. Currently **${q.length}** songs in queue ${(q.length > 10 ? '*[Only the next 10 are shown]*' : '')}`,
          `${q.length === 0 ? '' : `\`\`\`${q.slice(0, 10).join('\n')}\`\`\``}`
        ].join('\n'));
      }
    },
    "skip": {
      "name": "skip",
      "aliase": ['s'],
      "usage": "",
      "desc": "Skips the current song",
      "args": null,
      "hidden": false,
      "func": function () {
        if (client.queue[gid].playing === false) return message.channel.send(':negative_squared_cross_mark: No song is currently being played');

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
  function makeServerSettings() {
    client.queue[gid] = {
      playing: false,
      leave: false,
      songs: []
    };
  }
};

exports.cmdConfig = {
  name: "music",
  aliases: ['m'],
  description: "MUSIC",
  usage: "<command> [arguments]",
  type: "core",
  permission: null
};
