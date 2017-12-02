const yt = require('ytdl-core');

exports.run = (client, message) => {
  const settings = client.settings.get(message.guild.id);
  if (client.queue[message.guild.id] === undefined) return message.channel.send(`Add some songs to the queue first with ${settings.prefix}add`);
	const tosend = client.queue[message.guild.id].songs.map((song, i) => `${i + 1}. ${song.title} - Requested by: ${song.requester}`);
	return message.channel.send([
		`🗒 __**${message.guild.name}'s Music Queue:**__ Currently **${tosend.length}** songs queued ${(tosend.length > 15 ? '*[Only next 15 shown]*' : '')}`,
		`${'```'}${tosend.slice(0, 15).join('\n')}${'```'}`
  ].join('\n'));
};

exports.cmdConfig = {
  name: "queue",
  aliases: ['musicqueue', 'playlist'],
  description: "Displays the music queue.",
  usage: "queue",
  type: "music"
};