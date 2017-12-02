module.exports = (client, message) => {
  if (message.author.bot) return;
  client.vgs(client, message);
  client.pointsMonitor(client, message);
  client.replyArray(client, message);
  const settings = message.guild
    ? client.settings.get(message.guild.id)
    : client.config.serverSettings;
  message.settings = settings;
  if (message.content.indexOf(settings.prefix) !== 0) return;
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  cmd.run(client, message, args);
};
