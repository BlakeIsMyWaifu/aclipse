const moment = require('moment');
const vgs = require('../data/vgs.json');

module.exports = (client) => {
  client.log = (message) => {
    console.log(`[${moment().format("YYYY-MM-DD HH:mm:ss")}] ${message}`);
  };

  client.vgs = (client, message) => {
    if (message.channel.type !== 'text') return;
    if (vgs[message.content.toLowerCase()]) {
      message.channel.send(vgs[message.content.toLowerCase()]);
    }
  };
  
  client.replyArray = (client, message) => {
    if (message.channel.type !== 'text') return;
    if (client.config.replyObj[message.content.toLowerCase()]) {
      message.channel.send(client.config.replyObj[message.content.toLowerCase()]);
    }
  };
  
  client.pointsMonitor = (client, message) => {
    if (message.channel.type !=='text') return;
    const score = client.gpoints.get(message.author.id) || { points: 0, level: 0 };
    score.points++;
    score.level = Math.floor(0.1 * Math.sqrt(score.points));
    client.gpoints.set(message.author.id, score);
    
    const spoints = client.spoints.get(message.guild.id);
    if (!spoints[message.author.id] || spoints[message.author.id] === NaN) spoints[message.author.id] = [0, 0];
    spoints[message.author.id] = [parseInt(spoints[message.author.id][0]) + 1, parseInt(spoints[message.author.id][1]) + 1];
    client.spoints.set(message.guild.id, spoints);
  };

  
  client.awaitReply = async (msg, question, limit = 60000) => {
    const filter = m => m.author.id = msg.author.id;
    await msg.channel.send(question);
    try {
      const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
      return collected.first().content;
    } catch (e) {
      return false;
    }
  };

  client.clean = async (client, text) => {
    if (text && text.constructor.name == "Promise") {
      text = await text;
    }
    if (typeof evaled !== "string") {
      text = require("util").inspect(text, {depth: 0});
    }
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(client.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
    return text;
  };

  client.loadCommand = (commandName) => {
    try {
      const props = require(`../commands/${commandName}`);
      client.log(`Loading Command: ${props.cmdConfig.name}`);
      if (props.init) {
        props.init(client);
      }
      client.commands.set(props.cmdConfig.name, props);
      props.cmdConfig.aliases.forEach(alias => {
        client.aliases.set(alias, props.cmdConfig.name);
      });
      return false;
    } catch (e) {
      return `Unable to load command ${commandName}: ${e}`;
    }
  };

  client.unloadCommand = async (commandName) => {
    let command;
    if (client.commands.has(commandName)) {
      command = client.commands.get(commandName);
    } else if (client.aliases.has(commandName)) {
      command = client.commands.get(client.aliases.get(commandName));
    }
    if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(client);
    }
    delete require.cache[require.resolve(`../commands/${commandName}.js`)];
    return false;
  };

  client.wait = require("util").promisify(setTimeout);

  client.randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  
  client.isInArray = (array, string) => {
    return array.indexOf(string) > -1;
  };
  
  client.searchArrayOfObjects = (array, key, value) => {
    for (var i=0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  };
  
  Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)]
  };
  
  String.prototype.toProperCase = function() {
    return this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
  
  String.prototype.toMemeCase = function() {
    return this.split('').map((v, i) => i % 2 == 0 ? v.toLowerCase() : v.toUpperCase()).join('');
  };
  
  Object.prototype.getKeyByValue = function(value) {
    for (var prop in this) {
      if (this.hasOwnProperty(prop)) {
        if (this[prop] === value) {
          return prop;
        }
      }
    }
  };
  
  Array.min = function(array) {
    return Math.min.apply(Math, array);
  };
  
  Array.max = function(array) {
    return Math.max.apply(Math, array);
  };
  
  process.on("uncaughtException", (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Uncaught Exception: ", errorMsg);
    process.exit(1);
  });

  process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
  });
};
