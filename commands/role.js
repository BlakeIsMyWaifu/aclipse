const Discord = require('discord.js');

exports.run = (client, message, args) => {
  let manageMessages = message.member.hasPermission("MANAGE_ROLES");
  if (manageMessages === false) return message.channel.send(':negative_squared_cross_mark: You do not have permission. You need \`MANAGE_ROLES\`');
  let user = message.mentions.users.first();
  let usergm = message.guild.member(message.mentions.users.first());
  if (message.mentions.users.size < 1) {
    let search = args[0];
    if (!search) return message.channel.send(':negative_squared_cross_mark: ');
  } else {
    let roleName = args.slice(1).join(' ');
    if (!roleName) return message.channel.send(`:negative_squared_cross_mark: You need to give me a role to give to \`${user.username}\``);
    let role = message.guild.roles.find("name", roleName);
    if (!role) return message.channel.send(`:negative_squared_cross_mark: \`${roleName}\` isn't a role. It is case sensitive`);
    if (usergm.roles.has(role.id)) {
      if (message.member.highestRole.comparePositionTo(role) < 1) return message.channel.send(':negative_squared_cross_mark: You cannot remove a role higher or equal to your own from somebody');
      usergm.removeRole(role);
      return message.channel.send(`:white_check_mark: \`${role.name}\` has been removed from \`${user.username}\``);
    } else {
      if (message.member.highestRole.comparePositionTo(role) < 1) return message.channel.send(':negative_squared_cross_mark: You cannot give somebody a role higher or equal to your own');
      usergm.addRole(role);
      return message.channel.send(`:white_check_mark: \`${user.username}\` has been given \`${role.name}\``);
    }
  }
};

exports.cmdConfig = {
  name: "role",
  aliases: ['roles'],
  description: "Gives a user a role. Permission needed: MANAGE_ROLES.",
  usage: "roles [<@user> <role>] | [<action> <args>]",
  type: "mod"
};
