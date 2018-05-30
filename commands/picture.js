const Discord = require('discord.js');
const Canvas = require('canvas');
const fs = require('fs');
const request = require('request');

exports.run = async (client, message, [search, ...args]) => {
  var dataObj = {
    "art": {w: 2880, h: 1750, s: [439, 647], dx: 1230, dy: 443, r: 0, f: 'jpg'},
    "bird": {w: 1036, h: 581, s: 200, dx: 500, dy: 260, r: 350, f: 'png'},
    "bonobo": {w: 1200, h: 807, s: 256, dx: 195, dy: 150, r: 0, f: 'png'},
    "change": {w: 800, h: 450, s: [290, 155], dx: 380, dy: 108, r: 338, f: 'png'},
    "dumbarse": {w: 500, h: 487, s: 128, dx: 195, dy: 50, r: 0, f: 'png'},
    "f": {w: 960, h: 540, s: 100, dx: 349, dy: 90, r: 0, f: 'jpg'},
    "mistress": {w: 461, h: 276, s: [44, 60], dx: 275, dy: 90, r: 30, f: 'png'},
    "pan": {w: 513, h: 289, s: 90, dx: 65, dy: 75, r: 0, f: 'png'},
    "putin": {w: 1268, h: 1902, s: 178, dx: 615, dy: 126, r: 0, f: 'jpg'},
    "sandwich": {w: 625, h: 415, s: [200, 180], dx: 210, dy: 118, r: 0, f: 'jpg'},
    "santa": {w: 410, h: 563, s: [110, 128], dx: 186, dy: 197, r: 0, f: 'jpg'},
    "yugioh": {w:  765, h: 585, s: [344, 373], dx: 75, dy: -30, r: 351, f: 'png'}
  };
  let user = message.mentions.users.first() || message.author;
  if (client.isInArray(Object.keys(dataObj), search)) {
    var Image = Canvas.Image;
    var canvas = new Canvas(dataObj[search].w, dataObj[search].h);
    var ctx = canvas.getContext('2d');
    fs.readFile(`/home/blake/Desktop/aclipse/data/canvas/images/${search}.${dataObj[search].f}`, function(err, base) {
      var img = new Image;
      img.onload = function() {
        ctx.drawImage(img, 0, 0);
      }
      img.src = new Buffer(base, 'binary'); 
      request.get({url: user.avatarURL, encoding: null}, function(err, res, data) {
        var avatar = new Image();
        avatar.onload = function() {
          ctx.save();
          ctx.translate(dataObj[search].dx, dataObj[search].dy);
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(dataObj[search].r * Math.PI / 180);
          var scaleW = Array.isArray(dataObj[search].s) ? dataObj[search].s[0] : dataObj[search].s;
          var scaleH = Array.isArray(dataObj[search].s) ? dataObj[search].s[1] : dataObj[search].s;
          ctx.drawImage(avatar, -canvas.width / 2, -canvas.height / 2, scaleW, scaleH);
          ctx.restore();
        }
        avatar.src = new Buffer(data, 'binary');
        var out = fs.createWriteStream(__dirname + `/../data/canvas/out/${message.author.id}.png`);
        var stream = canvas.pngStream();
        stream.on('data', function(chunk){out.write(chunk);});
        stream.on('end', async function() {
          await client.wait(200);
          let i = new Discord.Attachment(`/home/blake/Desktop/aclipse/data/canvas/out/${message.author.id}.png`, `${search}.png`);
          return message.channel.send({files: [i]});
        });
      });
    });
  } else {
    return message.channel.send(Object.keys(dataObj).join(', '));
  }
};

exports.cmdConfig = {
  name: "picture",
  aliases: ['pic'],
  description: "?",
  usage: "<picture name> [mention]",
  type: "fun",
  permission: null
};
