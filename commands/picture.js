// at the top we have all the different packages that we want to load

// first we need to load in the discord.js lib (just short of library) so that we can send message on discord and stuff
const Discord = require('discord.js');

// canvas is what we are going to use to make the image that we send
const Canvas = require('canvas');

// fs stands for "file sync"
//we need this to load a local image from our pc
const fs = require('fs');

// this is used to load data from a website
//we are going to use this to get the users avatar
const request = require('request');

// this is where the actual code goes
//we are going to export it to the main framework that sorts out when a command is used
// we need to make it async (asynchronous) so that canvas can do it things
// client is just the client (the bots account)
// message is the message that the user sends when typing the command
// we split the argument (everything said after !picture) into an array (list)
// the first value in the array is named search because it determines what picture to edit
// all the rest is in another array called args (short for argument)
// args isn't really used but it is nice to split it after from search so it is a lot easier to get search
exports.run = async (client, message, [search, ...args]) => {
	
	// this is where all the data for each picture is stored
	// it is an object with each key (word in "") being a different picture
	// w is the width of the whole picture, it is needed when creating the base size of the canvas
	// h is the heigh just like w
	// s is the size of the avatar. some of them are arrays of numbers and some are numbers
	// this is because the numbers are when the avatar is a square and the arrays are when they are stretched to rectangles
	// dx is the destination x coordinate where the avatar will be placed
	// dy is the same just for y coordinate
	// r is the rotation of the avatar. most are 0 so they aren't rotated at all
	// f is the file type. it is either a png or jpg
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
	
	// the user is whomever you want to get the avatar from
	// the || is the logical operator OR
	// if somebody isn't mentioned then it would pick the author but if somebody is it will pick the first person mentioned
	let user = message.mentions.users.first() || message.author;
	
	// we are going to check if whatever is searched for is an actual available picture
	// if it isn't it will jump to the end of the if statement and send a list of available pictures
	// the client.isInArry() is a custom function just to check if something is an the array
	// Object.keys() makes an array that we can search
	// if you remember from before search is the first message after !picture
	if (client.isInArray(Object.keys(dataObj), search)) {
		
		// we are just doing the set-up for canvas to do it's thing
		var Image = Canvas.Image;
		
		// we are going to make the actual canvas
		// think of this as a painting in memory
		// we are making the size of the canvas equal to the size of base picture chosen
		// dataObj is the object of data
		// when you have the []'s after that means you are looking a specific key that is dynamic (depends on the variable search)
		// after that we have .w and .h which are static so we can just add them to the end
		var canvas = new Canvas(dataObj[search].w, dataObj[search].h);
		
		// this is the final thing to make the canvas
		// this just makes it a 2d image even though you can't make 3d ones
		// no idea why we actually need this but you do so yeah!
		var ctx = canvas.getContext('2d');
		
		// this is why we loaded the fs lib
		// this is just going to read the file that is chosen
		// we use back ticks (``) so that we can kinda embed the variable in the string (text)
		// first we put in the search so we get the right picture
		// then we put in the file type
		// the callback (function thing at the end) has two variables
		// first is if there are any errors it would be here
		// if there isn't then it will be undefined
		// base is the actual image loaded into memory 
		fs.readFile(`/home/blake/Desktop/aclipse/data/canvas/images/${search}.${dataObj[search].f}`, function(err, base) {
			
			// we are making another virtual image for the base image
			var img = new Image;
			
			// once the image is fully fully loaded it will trigger this event
			img.onload = function() {
				
				// we are placing the base image on the main canvas at the coordinates 0 0 so it fits in perfectly
				ctx.drawImage(img, 0, 0);
			}
		
			// we are making the image source be a buffer of the loaded file
			// a data buffer is just temporary memory in little pieces
			// it is like when you load a youtube video you can start watching before the whole thing is loaded
			// we are processing the image a little before it is fully loaded
			// we are making the encoding binary because as far as i am aware that is best for images
			img.src = new Buffer(base, 'binary');
			
			// this is where we use the request lib to make an HTTP (hypertext transfer protocol) call
			// we are making the url the link for the users avatar so we can load it
			// we don't need any encoding, headers or user-agents
			// the callback has three different variable
			// once again the first one is error
			// the second one is new. it is the response message telling us how the request went
			// if we get the code 200 we are all good. if you want all the codes => https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
			// the last is the most important, the actual data (also known as the body)
			request.get({url: user.avatarURL, encoding: null}, function(err, res, data) {
				
				// for the last time we are making the virtual image
				var avatar = new Image();
				
				// we are waiting for the image to load
				// it is a lot more important here because we are getting the image from the internet rather than local
				avatar.onload = function() {
					
					// this is where are are actually adding the avatar over the base image
					// we are saving NOT the image but the current transformation matrix, clipping and other stuff that i don't care about
					ctx.save();
					
					// we are moving the base image outside the canvas area
					// i know it sounds weird but when we rotate the avatar it rotates it from the middle
					// and we want the middle to be where ever we want the avatar
					ctx.translate(dataObj[search].dx, dataObj[search].dy);
					
					// the property width and height of canvas is self explanatory
					// gonna be honest and do not remember why we do this but it works so yeah
					ctx.translate(canvas.width / 2, canvas.height / 2);
					
					// when we are rotating it works in radians and not degrees
					// we are storing the amount we want to rotate in degrees because that is easy to understand and change
					// (degrees x PI / 180) is the easiest way to convert them 
					ctx.rotate(dataObj[search].r * Math.PI / 180);
					
					// we want the size of the avatar but we have two different ways to store them
					// some are in arrays and some are numbers
					// we need to sort them because we can't ask for the second value in an array if it is just one number
					// we are going to use a ternary operator
					// like saying if a statement is true give it this value if not give it another
					// the statement we are testing is if the value s is an array or not
					// if it is it will be the cosponsoring value if not it will just be the number
					// we do this for both width and height
					var scaleW = Array.isArray(dataObj[search].s) ? dataObj[search].s[0] : dataObj[search].s;
					var scaleH = Array.isArray(dataObj[search].s) ? dataObj[search].s[1] : dataObj[search].s;
					
					// now we are going to draw the avatar on the whole (possibly rotated) canvas
					ctx.drawImage(avatar, -canvas.width / 2, -canvas.height / 2, scaleW, scaleH);
					
					// remember when we saved the placement of where the base image should be, we are loading that
					// the avatar will rotate with it
					ctx.restore();
				}
				
				// same as before
				avatar.src = new Buffer(data, 'binary');
				
				// now we are going to make a write stream location of the finished data
				// we are selecting the dir (directory) where we want the image to go to
				// we are making the image called the id of the user otherwise only one person would be able to use it at a time
				// we are making it a png just so it is lossless (doesn't lose any data on compression so it looks clean)
				var out = fs.createWriteStream(__dirname + `/../data/canvas/out/${message.author.id}.png`);
				
				// we are making the actual stream data here
				var stream = canvas.pngStream();
				
				// so this event is triggered every time a chunk is finished
				// a chunk is just like the buffer where a little bit of the data is written each time
				stream.on('data', function(chunk){out.write(chunk);});
				
				// this event is triggered once it is finished
				// it is async so that we can use await
				stream.on('end', async function() {
					
					// this is another custom function which just stops the code for 0.2 seconds
					// because javaSCRIPT is a scripting language it processes everything line by line unless it is in an asynchronous function
					// now that i think about it is, it is very weird that we make it be able to do all lines at the same time so that we can make it not
					// moving on, we actually make it wait because sometimes the image isn't fully fully ready on the disk and discord would send half complete images
					// js is always done in milliseconds 
					await client.wait(200);
					
					// we are making the attachment that the discord.js lib can send
					// first we select the file
					// then we can set the name to anything we want
					// i just use the name of the base picture chosen
					let i = new Discord.Attachment(`/home/blake/Desktop/aclipse/data/canvas/out/${message.author.id}.png`, `${search}.png`);
					
					// now we just end it with sending the picture
					// return means end the process with whatever is after it and just kinda turns off
					return message.channel.send({files: [i]});
				});
			});
		});
		
	// this else is if the previous if statement wasn't true
	} else {
		
		// we are just going to return the list of available pictures
		// we are turning the dataObj keys into an array and then joining them into a string (text)
		// they are joined by ", " so they look like an actual list
		return message.channel.send(Object.keys(dataObj).join(', '));
	}
};

// this is just the config used to load the command and used by the help command
exports.cmdConfig = {
	name: "picture",
	aliases: ['pic'],
	description: "?",
	usage: "<picture name> [mention]",
	type: "fun",
	permission: null
};
