const yt = require('ytdl-core');

exports.run = (client, message) => {
  const voiceChannel = message.member.voiceChannel;
	if (!voiceChannel || voiceChannel.type !== 'voice') throw "I couldn't connect to your voice channel...";
  return voiceChannel.join();
};

exports.cmdConfig = {
  name: "join",
  aliases: ['musicjoin'],
  description: "Joins the message author's voice channel.",
  usage: "join",
  type: "music"
};