module.exports = (client, member) => {
  const settings = client.settings.get(member.guild.id);
  if (settings.welcomeEnabled === "true") {
    let welcomeMessage = settings.welcomeMessage;
    welcomeMessage = welcomeMessage.replace("{{user}}", member.user.tag);
    welcomeMessage = welcomeMessage.replace("{{guild}}", member.guild.name);
    welcomeMessage = welcomeMessage.replace("{{memberCount}}", member.guild.memberCount);
    let welcomeChannel = member.guild.channels.find("name", settings.defaultChannel);
    if (!welcomeChannel) return member.guild.channels.find(c=> c.permissionsFor(member.guild.me).has("SEND_MESSAGES")).send(`:negative_squared_cross_mark: ${settings.defaultChannel} was not found`);
    member.guild.channels.find("name", settings.defaultChannel).send(welcomeMessage);
  }
  if (settings.autoRole === "true") {
    let role = member.guild.roles.find("name", settings.autoRole);
    if (!role) return;
    member.addRole(role);
  }
};
