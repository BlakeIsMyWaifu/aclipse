module.exports = (client, guild) => {
  client.settings.set(guild.id, client.config.serverSettings);
  client.spoints.set(guild.id, client.config.serverPoints);
}
