const Discord = require('discord.js');
require('node-opus');

exports.run = async (client, message, [search, ...args]) => {
	if (typeof client.voice !== 'string' || client.voice instanceof String) {
		client.voice = "PATH";
	}
	var path = (f) => {
		var filePath = [
			"/home/blake/Desktop/aclipse/data/sound/",
			client.voice,
			f,
			".ogg"
		];
		return filePath.join('');
	}
	if (message.author.id !== client.config.ownerId) return;
	if (!args) return message.channel.send('!args');
	if (search === "l") {
		client.voice = args.join('/');
		return message.channel.send(`Loaded: \`${path('/FILE')}\``)
	} else if (search === "c") {
		return message.channel.send(path('/FILE'));
	} else if (search === "s") {
		message.channel.send('collector started');
		const collector = message.channel.createMessageCollector(message => message, {time: 30000});
		collector.on('collect', m => {
			if (m.author.id !== client.config.ownerId) return;
			if (m.content.toLowerCase() === "-stop") {
				collector.stop('stop');
				return;
			}
			if (m.content.toLowerCase().startsWith('-')) {
				console.log("play?");
				play();
				async function play() {
					var broadcast = client.createVoiceBroadcast();
					if (!message.guild.voiceConnection) {
		        let vc = message.member.voiceChannel;
		        if (!vc || vc.type !== 'voice') return message.channel.send(':negative_squared_cross_mark: I couldn\'t find your voice chat?');
		        vc.join();
		      }
					broadcast.playFile("/home/blake/Desktop/aclipse/data/sound/" + client.voice + m.content.toLowerCase() + ".ogg");
					var dispatcher;
					dispatcher = message.guild.voiceConnection.playBroadcast(broadcast);
					dispatcher.on('end', () => {
						console.log('?');
					});
					dispatcher.on('error', (err) => {
						return message.channel.send(`voice err: ${err}`);
					});
				}
			}
		});
		collector.on('end', (collected, reason) => {
			if (reason === 'time') return message.channel.send('voice timeout');
			if (reason === 'stop') {
				message.member.voiceChannel.leave();
				return message.channel.send('voice stopped');
			}
		});
	} else {
		return message.channel.send('else');
	}
};

exports.cmdConfig = {
  name: "voice",
  aliases: [],
  description: "WIP",
  usage: "?",
  type: "client",
  permission: null
};