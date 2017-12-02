const Discord = require('discord.js');
const { inspect } = require("util");

exports.run = async (client, message, [search, key, ...value]) => {
  const settings = client.settings.get(message.guild.id);
  let perms = message.member.hasPermission("ADMINISTRATOR");
  let adminRole = message.guild.roles.find("name", settings.adminRole);
  if (perms === false || message.member.roles.has(adminRole) || message.author.id !== client.config.ownerId) return message.channel.send(':negative_squared_cross_mark: You do not have permission. You need \`ADMINISTRATOR\`');
  if (search === "help") {
    var cmdArray = [
      ["add", "<key> <value>", "No too show why this is here yet but it is so..."],
      ["edit", "<key> <value>", "Changes your server settings"],
      ["del", "<key> <value>", "Deletes a server settings (restores the one key to default)"],
      ["reset", "", "Resets all your server settings"],
      ["get", "<key> <value>", "tells you the value of a given key"]
    ];
    const helpEmbed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setTitle('**Dashboard Help**');
    for (let [cmdName, cmdUsage, cmdDesc] of cmdArray) {
       helpEmbed.addField(cmdName, `${settings.prefix}dashboard ${cmdName} ${cmdUsage}\n${cmdDesc}`);
    }
    message.channel.send({embed: helpEmbed});
  } else if (search === "add") {
    if (!key) return message.channel.send(":negative_squared_cross_mark: Please specify a key to add");
    if (settings[key]) return message.channel.send(":negative_squared_cross_mark: This key already exists in the settings");
    if (value.length < 1) return message.channel.send(":negative_squared_cross_mark: Please specify a value");
    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.channel.send(`:white_check_mark: \`${key}\` successfully added with the value of \`${value.join(" ")}\``);
  } else if (search === "edit") {
    if (!key) return message.channel.send(":negative_squared_cross_mark: Please specify a key to edit");
    if (!settings[key]) return message.channel.send(":negative_squared_cross_mark: This key does not exist in the settings");
    if (value.length < 1) return message.channel.send(":negative_squared_cross_mark: Please specify a new value");
    settings[key] = value.join(" ");
    client.settings.set(message.guild.id, settings);
    message.channel.send(`:white_check_mark: \`${key}\` successfully edited to \`${value.join(" ")}\``);
  } else if (search === "del") {
    if (!key) return message.channel.send(":negative_squared_cross_mark: Please specify a key to delete.");
    if (!settings[key]) return message.channel.send(":negative_squared_cross_mark: This key does not exist in the settings");
    const response = await client.awaitReply(message, `:warning: Are you sure you want to permanently delete ${key}? This **CANNOT** be undone.`);
    if (["y", "yes"].includes(response)) {
      delete settings[key];
      client.settings.set(message.guild.id, settings);
      message.channel.send(`:white_check_mark: \`${key}\` was successfully deleted.`);
    } else if (["n", "no", "cancel"].includes(response)) {
      message.channel.send(":white_check_mark: Action cancelled.");
    }
  } else if (search === "reset") {
    const response = await client.awaitReply(message, `:warning: Are you sure you want to permanently reset ALL server settings? This **CANNOT** be undone.`);
    if (["y", "yes"].includes(response)) {
      client.settings.delete(message.guild.id);
      client.settings.set(message.guild.id, client.config.serverSettings);
      message.channel.send(`:white_check_mark: All server settings have been deleted.`);
    } else if (["n", "no", "cancel"].includes(response)) {
      message.channel.send(":white_check_mark: Action cancelled.");
    }
  } else if (search === "get") {
    if (!key) return message.channel.send(":negative_squared_cross_mark: Please specify a key to view");
    if (!settings[key]) return message.channel.send(":negative_squared_cross_mark: This key does not exist in the settings");
    message.channel.send(`The value of \`${key}\` is currently \`${settings[key]}\``);
  } else {
    message.channel.send(inspect(settings), {code: "json"});
  }
};

exports.cmdConfig = {
  name: "dashboard",
  aliases: ['db', 'settings'],
  description: "Changes the bots settings for the server. Permission needed: ADMINISTRATOR",
  usage: "dashboard <command> [key] [value]",
  type: "mod"
};
