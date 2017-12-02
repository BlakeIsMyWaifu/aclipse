const yt = require('ytdl-core');
require('node-opus');

exports.run = async (client, message) => {
  const settings = client.settings.get(message.guild.id);
  if (client.queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${settings.prefix}add`);
	if (!message.guild.voiceConnection) return client.commands.get('join').run(client, message).then(() => client.commands.get('play').run(client, message)).catch(err => { throw err; });
	if (client.queue[message.guild.id].playing) return message.channel.send('Already Playing');
	let dispatcher;
	client.queue[message.guild.id].playing = true;
	(function play(song) {
		if (song === undefined) {
			return message.channel.send('⏹ Queue is empty').then(() => {
				client.queue[message.guild.id].playing = false;
				message.member.voiceChannel.leave();
			});
		}
		message.channel.send(`🎧 Playing: **${song.title}** as requested by: **${song.requester}**`);
		dispatcher = message.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes: client.config.passes });
		const collector = message.channel.createMessageCollector(message => message);
		collector.on('collect', m => {
			if (m.content.startsWith(`${settings.prefix}pause`)) {
				return message.channel.send('⏸ Paused').then(() => { dispatcher.pause(); });
			} else if (m.content.startsWith(`${settings.prefix}resume`)) {
				return message.channel.send('▶ Resumed').then(() => { dispatcher.resume(); });
			} else if (m.content.startsWith(`${settings.prefix}skip`)) {
				return message.channel.send('⏭ Skipped').then(() => { dispatcher.end(); });
			}
			return null;
		});
		dispatcher.on('end', () => {
			collector.stop();
			client.queue[message.guild.id].songs.shift();
			play(client.queue[message.guild.id].songs[0]);
		});
		dispatcher.on('error', (err) => message.channel.send(`error: ${err}`).then(() => {
			collector.stop();
			client.queue[message.guild.id].songs.shift();
			play(client.queue[message.guild.id].songs[0]);
		}));
		return null;
	}(client.queue[message.guild.id].songs[0]));
  return null;
};

exports.cmdConfig = {
  name: "play",
  aliases: ['musicplay'],
  description: "Plays the queue.",
  usage: "play",
  type: "music"
};