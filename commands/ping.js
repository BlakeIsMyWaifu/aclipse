exports.run = async (client, message, args) => {
  const msg = await message.channel.send("Ping?");
  msg.edit(`**Pong:** ${msg.createdTimestamp - message.createdTimestamp}ms | **API:** ${Math.round(client.ping)}ms`);
};

exports.cmdConfig = {
  name: "ping",
  aliases: [],
  description: "Ping/Pong command. I wonder what this does?",
  usage: "ping",
  type: "core"
};
