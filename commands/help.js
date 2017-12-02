const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const settings = client.settings.get(message.guild.id);
  if (!args[0]) {
    let cmdName = client.commands.map(c => `${c.cmdConfig.name}type=${c.cmdConfig.type}`);
    let core = cmdName.filter(filterCore).join(', ').replace(/type=core/g, '');
    let fun = cmdName.filter(filterFun).join(', ').replace(/type=fun/g, '');
    let info = cmdName.filter(filterInfo).join(', ').replace(/type=info/g, '');
    let music = cmdName.filter(filterMusic).join(', ').replace(/type=music/g, '');
    let mod = cmdName.filter(filterMod).join(', ').replace(/type=mod/g, '');
    let clnt = cmdName.filter(filterClnt).join(', ').replace(/type=client/g, '');
    const normalHelp = new Discord.RichEmbed()
      .setColor(settings.embedColour)
      .setThumbnail(client.user.avatarURL)
      .setTitle(`Use ${settings.prefix}help [command] for more infomation`)
      .addField('Core', core)
      .addField('Fun', fun)
      .addField('Infomation', info)
      .addField('Music', music)
      .addField('Mod', mod);
    if (message.author.id === client.config.ownerId) normalHelp.addField('Client', clnt);
    message.channel.send({embed: normalHelp});
  } else {
    let command = args[0];
    if (client.commands.has(command)) {
      command = client.commands.get(command);
      const commandHelp = new Discord.RichEmbed()
        .setColor(settings.embedColour)
        .setTitle(cap(command.cmdConfig.name))
        .addBlankField()
        .addField('Description', command.cmdConfig.description)
        .addField('Usage', command.cmdConfig.usage)
        .addField('Type', command.cmdConfig.type);
      message.channel.send({embed: commandHelp});
    } else {
      message.channel.send(`:negative_squared_cross_mark: I could not find the command \`${args.join(' ')}\`, trying using \`${settings.prefix}help\` to get a list of all commands.`);
    }
  }
};

function filterCore(type) {
  return type.includes('type=core');
}

function filterFun(type) {
  return type.includes('type=fun');
}

function filterInfo(type) {
  return type.includes('type=info');
}

function filterMusic(type) {
  return type.includes('type=music');
}

function filterMod(type) {
  return type.includes('type=mod');
}

function filterClnt(type) {
  return type.includes('type=client');
}

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

exports.cmdConfig = {
  name : "help",
  aliases: ['h', 'halp', 'command', 'commands'],
  description: "A help command that list all the bots commands and gives infomation about how to use them.",
  usage: "help [command]",
  type: "core"
};


