const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const settings = client.settings.get(message.guild.id);
  if (!args[0]) {
    let myCommands = client.commands.array();
    const helpEmbed = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setThumbnail(client.user.avatarURL)
      .setTitle(`Use ${settings.prefix}help [command] for more infomation`);
    let cmdObject = {};
    for (let cmd of myCommands) {
      cmd = cmd.cmdConfig;
      if (cmdObject.hasOwnProperty(cmd.type) === false) {
        cmdObject[cmd.type] = [cmd.name];
      } else {
        cmdObject[cmd.type].push(cmd.name);
      }
    }
    if (message.author.id !== client.config.ownerId) delete cmdObject.client;
    Object.keys(cmdObject).sort().forEach(category => {
      helpEmbed.addField(category.toProperCase(), cmdObject[category].join(', '));
    });
    return message.channel.send({embed: helpEmbed});
  } else {
    if (client.commands.has(args[0])) {
      let command = client.commands.get(args[0]).cmdConfig;
      let cmd = [
        `**Description:** ${command.description}`,
        `**Usage:** ${command.name} ${command.usage}`,
        `**Type:** ${command.type}`
      ];
      if (command.permission !== null) cmd.push(`**Permission Needed:** ${command.permission}`);
      const commandEmbed = new Discord.RichEmbed()
        .setColor(settings.embedColour)
        .addField(command.name.toProperCase(), cmd.join('\n'));
      return message.channel.send({embed: commandEmbed});
    } else {
      return message.channel.send(`:negative_squared_cross_mark: I could not find the command \`${args[0]}\`, trying using \`${settings.prefix}help\` to get a list of all commands.`);
    }   
  }
};

exports.cmdConfig = {
  name : "help",
  aliases: ['h', 'halp', 'command', 'commands'],
  description: "A help command that list all the bots commands and gives infomation about how to use them.",
  usage: "[command]",
  type: "core",
  permission: null
};


