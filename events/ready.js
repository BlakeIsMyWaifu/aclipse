module.exports = async client => {
  await client.wait(1000);
  client.log(`${client.user.tag}, ready to serve ${client.users.size} users in ${client.guilds.size} servers.`);
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.serverSettings));
  client.guilds.filter(g => !client.spoints.has(g.id)).forEach(g => client.spoints.set(g.id, client.config.serverPoints));
  let minutes = client.config.gameChangeTime;
  let interval = minutes * 60 * 1000;
  let activity = {
    "p": "PLAYING",
    "s": "STREAMING",
    "l": "LISTENING",
    "w": "WATCHING"
  };
  setInterval(function() {
    let game = client.config.games;
    game = game[Math.floor(Math.random() * game.length)];
    client.user.setActivity(game[1], {'type': activity[game[0]]});
  }, interval);
};

const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) => {
  response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 240000);
