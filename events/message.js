module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") {
    const request = require('request');
    function ask() {
      var options = {
        method: 'post',
        body: {
          "user": process.env.CLEVERUSER,
          "key": process.env.CLEVERKEY,
          "nick": message.author.id,
          "text": message.content
        },
        json: true,
        url: 'https://cleverbot.io/1.0/ask'
      };
      request(options, function (err, res, body) {
        console.log(`[${message.author.username}] ${message.content} - ${body.response}`);
        if (body.status !== "success") return message.channel.send(body.status);
        return message.channel.send(body.response);
      });
    }
    if (Array.isArray(client.clever) === false) {client.clever = [];}
    if (client.clever.includes(message.author.id) === false) {
      client.clever.push(message.author.id);
      var options = {
        method: 'post',
        body: {
          "user": process.env.CLEVERUSER,
          "key": process.env.CLEVERKEY,
          "nick": message.author.id
        },
        json: true,
        url: "https://cleverbot.io/1.0/create"
      };
      request(options, function (err, res, body) {
        if (err) {
          return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
        } else if (res.statusCode !== 200) {
          return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
        } else {
          ask()
        }
      });
    } else {
      ask()
    }
  } else {
    let idArray = client.config.blacklist;
    client.vgs(client, message);
    client.pointsMonitor(client, message);
    client.replyArray(client, message);
    const settings = message.guild ? client.settings.get(message.guild.id) : client.config.serverSettings;
    message.settings = settings;
    if (message.content.indexOf(settings.prefix) !== 0) return;
    for (let userId of idArray) {
      if (message.author.id === userId) return message.channel.send(':negative_squared_cross_mark: You are on the blacklist');
    }
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;
    cmd.run(client, message, args);
  }
};
