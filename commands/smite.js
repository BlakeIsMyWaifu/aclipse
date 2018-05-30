// get the discord.js lib so that we can actually do stuff
const Discord = require('discord.js');

// require so that we can make GET requests
const request = require('request');

// require moment so that we can get the date and time for the smite api easily
const moment = require('moment');

// require md5 so that we can hash our signature for the smite api
const md5 = require('md5');

// require util so that we can send the data in discord chat so we know the paths
const { inspect } = require("util");

// make it asynchronous so that later we can wait for the GET request data
exports.run = async (client, message, [search, ...args]) => {
  
/*
    Help Section
*/
  
  // make search lowercase so when we use it it won't be case sensative
  if (search) search = search.toLowerCase();
  
  // make an empty array that we can add all the command names to later
  // i chose to use '= [];' over '= new Array' just because i think it looks nicer and it doesn't matter in this case
  var cmdList = [];
  
  // here we have all the commands, there usage, a description and the error if they don't send an argument
  // yes i know the names are bad but i don't know what else to name them because it is an array or arrays
  var cmdArray = [
    ["player", "<player>", "Displays a players stats", "Who would you like me to look up?"],
    ["mastery", "<player> [number]", "Displays a players highest masteried Gods", "Who would you like me to look up?"],
    ["god", "<god>", "Displays infomation on a chosen God", "Which God would you like me to look up?"],
    ["ability", "<god> <ability number>", "Displays the God ability", "Which God would you like me to look up?"],
    ["item", "<item | term>", "not sure yet", "Which item would you like me to look up?"],
    // not sure if i should keep the friends command
    // might be an invasion of privacy type of thing
    ["friends", "<player>", "Lists all of there friends without private profiles", "Who would you like me to look up?"]
  ];
  
  // we get the server settings so we know what embed colour they want on the help embed
  const settings = client.settings.get(message.guild.id);
  
  // make the help embed that will show all the command infomation on smite
  const helpEmbed = new Discord.RichEmbed()
  
    // we set the colour to whatever the server setting colour it
    .setColor(settings.embedColour)
  
    // we are making the title 'smite help' so they know what the commands are for
    .setTitle('**Smite Help**');
  
  // we loop through all the commands
  // i could have used forEach maybe? i don't really know how to use that so i went for a for loop
  for (let [cmdName, cmdUsage, cmdDesc, cmdError] of cmdArray) {
    
    // add the command name to the empty array we made earlier
    cmdList.push(cmdName);
    
    // make a new field for each of the commands showing the name, usage and description
    // we don't sent the error here, it is for another section
    helpEmbed.addField(cmdName, `${settings.prefix}smite ${cmdName} ${cmdUsage}\n${cmdDesc}`);
  }
  
  // if they requested for the help command or if they didn't request for anything then it shows the list of commands
  if (search === "help" || search === undefined) {
    
    // sending the help embed
    // we returned it here because we don't need the rest of the code; we are done
    return message.channel.send({embed: helpEmbed});
  }
  
  // here is where we make aliases for some of the commands so that it is easier to use
  // the key is what the aliase is and the value is what it should be
  var aliaseObj = {
    "masteries": "mastery",
    "gods": "god",
    "items": "item"
  };
  
  // we make the aliases into an array so that it can be searched easier (i am too lazy to make a function to search object keys so i just used the one to search arrays)
  var aliaseArray = Object.keys(aliaseObj);
  
  // here we check if the user has sent an argument
  if (!args[0]) {
    
    // if they haven't then we loop through all the commands and get the correct error
    for (let [cmdName, cmdUsage, cmdDesc, cmdError] of cmdArray) {
      
      // this will post the correct error and stop BEFORE we start using the smite api
      if (search === cmdName) return message.channel.send(`:negative_squared_cross_mark: ${cmdError}`);
    }
  }
  
  // if the aliases is picked up then it changes what the user had requested to the correct usage
  if (client.isInArray(aliaseArray, search) === true) search = aliaseObj[search];
  
  // we check if the command is valid BEFORE we start using the smite api
  if (client.isInArray(cmdList, search) === false) return message.channel.send(':negative_squared_cross_mark: Unknown command');
  
/*
    Setup Variables Section
*/
  
  // this is the smite api domain just so we never have to retype or copy and paste it
  const domain = "http://api.smitegame.com/smiteapi.svc/";
  
  // this loads my developer ID that was give to me by the smite api
  // i am using glitch.com to host the bot at the moment so it is in the .env file for safety
  const devID = process.env.SMITEDEVID;
  
  // uses the moment package to get the date and time
  let timestamp = moment().format('YYYYMMDDHHmmss');
  
  // same thing as the devID
  const authKey = process.env.SMITEAUTHID;
  
  // i made a function for this because each method uses a different signature and i didn't want to copy and paste the same thing over and over again
  function createSignature(method) {
    
    // it just md5 hashs all the previous details together so it can be placed into the urls later
    return md5(`${devID}${method}${authKey}${timestamp}`);
  }
  
  // this is all the smite ranked ranks with a hex colour for embeds later
  var rankedTierObj = {
    // not sure about his unranked colour, does bright red work or should i make it blank?
    "Unranked": "#ff0000",
    // here is where i would be placed if i played ranked, good old bronze 5
    "Bronze V": "#a0460a",
    "Bronze IV": "#a0460a",
    "Bronze III": "#a0460a",
    "Bronze II": "#a0460a",
    "Bronze I": "#a0460a",
    "Silver V": "#a0a0a0",
    "Silver IV": "#a0a0a0",
    "Silver III": "#a0a0a0",
    "Silver II": "#a0a0a0",
    "Silver I": "#a0a0a0",
    "Gold V": "#dca032",
    "Gold IV": "#dca032",
    "Gold III": "#dca032",
    "Gold II": "#dca032",
    "Gold I": "#dca032",
    "Platinum V": "#508c28",
    "Platinum IV": "#508c28",
    "Platinum III": "#508c28",
    "Platinum II": "#508c28",
    "Platinum I": "#508c28",
    "Diamond V": "#2864c8",
    "Diamond IV": "#2864c8",
    "Diamond III": "#2864c8",
    "Diamond II": "#2864c8",
    "Diamond I": "#2864c8",
    // never knew there was only one masters tier. the more you know i guess
    "Masters": "#ff00ff"
  };
  
  // just an array of all the ranked ranks
  var rankedTierArray = Object.keys(rankedTierObj);
  
  // this is same thing but with the roles
  var roleObj = {
    "assassin": "#ffff00",
    // the best role
    "guardian": "#14ff00",
    // the second best role
    "hunter": "#ff6400",
    "mage": "#ff00ff",
    "warrior": "#ff0000"
  };
  
  // this is so that they can get a list of all items with a given filter
  var itemObj = {
    "starter": ["StartingItem", true],
    "tier 1": ["ItemTier", 1, "StartingItem", false, "Type", "Item"],
    "tier 2": ["ItemTier", 2, "Type", "Item"],
    "tier 3": ["ItemTier", 3],
    "physical power": ["Physical Power"],
    "magical power": ["Magical Power"],
    "attack speed": ["Attack Speed"],
    "physical lifesteal": ["Physical Lifesteal"],
    "magical lifesteal": ["Magical Lifesteal"],
    "physical penetration": ["Physical Penetration"],
    "magical penetration": ["Magical Penetration"],
    "crit": ["Critical Strike Chance"],
    "crit chance": ["Critical Strike Chance"],
    "physical protection": ["Physical Protection"],
    "magical protection": ["Magical Protection"],
    "health": ["Health"],
    "ccr": ["Crowd Control Reduction"],
    "crowd control reduction": ["Crowd Control Reduction"],
    "hp5": ["HP5"],
    "health per 5": ["HP5"],
    "health per five": ["HP5"],
    "movement": ["Movement Speed"],
    "movement speed": ["Movement Speed"],
    "cooldown": ["Cooldown Reduction"],
    "cooldown %": ["Cooldown Reduction"],
    "cool down": ["Cooldown Reduction"],
    "mana": ["Mana"],
    "mana per 5": ["MP5"],
    "mana per five": ["MP5"],
    "relic": ["Type", "Active", "ItemTier", 2],
    "relics": ["Type", "Active", "ItemTier", 2],
    "consumable": ["Type", "Consumable"],
    "consumables": ["Type", "Consumable"]
  };
  
  // make it into an array so it can be searched easily
  var itemArray = Object.keys(itemObj);
  
/*
    API GET Requests section
*/
  
  // this is to test if a session is currently active
  // i forgot why it is asynchronous but i am sure i had a reson
  const testSession = async () => {
    
    // uses the function we made earlier so make a signature with the method testsession
    var signature = createSignature("testsession");
    
    // use the request package to make a GET request
    request.get({
      
      // it justs puts all the variables together to make a url
      // i made a persistant collection with just one variable called sessionID to save the last sessionID that was used
      // the persistant collection is enmap. i have no idea how to use it properly but it works so i don't touch it
      url: domain + `testsessionJson/${devID}/${signature}/${client.session.get("sessionID")}/${timestamp}`,
      
      // the response that we want is JSON
      json: true,
      
      // i have no idea what this does but it works so i leave it
      headers: {'User-Agent': 'request'}
      
    // we are declaring what the response are
    // err = error, res = response (status codes), data = the JSON
    }, (err, res, data) => {
      
      // if there is an error . . .
      if (err) {
        
        // post the error in discord chat so that i work out what the problem is
        return message.channel.send(':negative_squared_cross_mark: Error:' + err);
        
        // if the response code is not 200 (OK) then . . .
      } else if (res.statusCode !== 200) {
        
        // post what the code is in discord chat so i know what went wrong
        return message.channel.send(':negative_squared_cross_mark: Status:' + res.statusCode);
        
        // if is all good then continue
      } else {
        
        // sometimes i want to see what comes but so i left this here but commented out
        // console.log(data);
        
        // the response is a string which is kinda annoying but whatever
        // i split it into an array so i can process the start of it
        let message = data.split(' ');
        
        // i just want the first 3 words
        message = message[0] + message[1] + message[2];
        
        // if the session is too old (15 minutes or more) then make a new one and continue
        if (message === "Invalidsessionid.") {
          
          // call the creatsession function
          createSession();
          
          // if i want to know what happened i made these console.logs
          // console.log("A new session is being created");
          
          // if the signature is invaild then something messed up. it has only happened once and hopefully it never happens again
        } else if (message === "Invalidsignature.Your") {
          
          // as i said before sometimes i want to know what is going on
          // console.log("The signature was rejected");
          
          // just letting discord chat know when something goes wrong, why
          return message.channel.send(':negative_squared_cross_mark: Invaid signature? If this error pops up the bot is really broken. Lets hope i never have to read this again!');
          
          // if there was no problems then continue
        } else if (message === "Thiswasa") {
          
          // you get the idea with these console.logs
          // console.log("we good!");
        }
      }
    });
  };
  // next i made the createsession function for when the last session is too old (15 minutes or more)
  // once again it is asynchronous and i am not sure why
  const createSession = async () => {
    
    // uses the function again to make the hashed signature
    var signature = createSignature("createsession");
    
    // makes another GET request but this time using the createsession method
    request.get({
      
      // this one is a bit simplier than the testsession one because i don't need to get the last session from the presistant collection
      url: domain + `createsessionJson/${devID}/${signature}/${timestamp}`,
      
      // they actually send it in JSON unlike in testsession where they send it as a string even though in the url i request for JSON and in the json i request true
      // still mad about that
      json: true,
      
      // does things beyond me
      headers: {'User-Agent': 'request'}
      
    // we are declaring what the response are
    // err = error, res = response (status codes), data = the JSON
    }, (err, res, data) => {
      
      // i explained this before in when i was talking about test session, i don't need to explain it all again
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error:' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status:' + res.statusCode);
      } else {
        
        // if there were no problems then it gets the session id that they sent IN JSON (YAY!) and saves it to the persistant collection
        client.session.set("sessionID", data.session_id);
      }
    });
  };
  // the main function. this is where almost everything happens
  const requestData = (method, parameters) => {
    
    // just like every other time we hash the custom signature
    var signature = createSignature(method);
    
    // sometimes when i use a new method i want to get the url so i can open it open in the browser myself and see what i can do with it
    let url = domain + `${method}Json/${devID}/${signature}/${client.session.get("sessionID")}/${timestamp}/${parameters}`;
    
    // as i said but i want to url
    // console.log(url);
    
    // same thing as the other two times
    request.get({
      url: url,
      
      // i am having second thought on having this here but i am too scared to remove it
      // if it works it works so i am not going to touch it even though i think it is just a wasted line
      json: true,
      
      
      // i have been over this twice already, you get the idea
      headers: {'User-Agent': 'request'}
      
    // blah blah blah declaring what the response are
    // blah blah blah err = error, res = response (status codes), data = the JSON
    }, (err, res, data) => {
      if (err) {
        return message.channel.send(':negative_squared_cross_mark: Error: ' + err);
      } else if (res.statusCode !== 200) {
        return message.channel.send(':negative_squared_cross_mark: Status: ' + res.statusCode);
      } else {
        // once we get the data we are going to sort through what the user searched for
        
        
        // if (data.length === 0) return message.channel.send(':negative_squared_cross_mark: Infinity error');
        
/*
    Player
*/
        
        if (search === "player") {
          
          // if there is no player with the name that they sent this is will return before we start geting all sort of undefined errors
          // note that it is NOT case sensative
          if (!data[0]) return message.channel.send(`:negative_squared_cross_mark: I could not find that player. Either \`${args[0]}\` is wrong or the profile is private`);
          
          // we are going to asign the variable p to the data
          // even though they only send one object they always send an array
          // p is short for player if you didn't realise
          var p = data[0];
          
          // if the user is in a clan they sent the name as '[clanTag]playerName'
          // AARRRR
          // it is just so annoying because it is the only was to get the players clan tag without sending another request to the clanthing method
          // they also don't have another variable were they send a clean version
          // here we just sort it to see if they are in a clan or not
          if (p["Name"].startsWith('[') === true) {
            
            // first we get rid of the [
            // then we split it at ] so it because an array
            // the array would be [clanTag, playerName]
            var name = p["Name"].replace('[', '').split(']');
            
            // next we want to get the clan tag before we change name into a string of just the name
            // we also display the full clan name
            var clan = `[${name[0]}] ${p.Team_Name}`;
            
            // we change name into a string which is a clean version on their name
            name = name[1];
            
          // if they aren't in a clan . . .
          } else {
            
            // the name is just a clean string so it is easy to work with
            var name = p.Name;
            
            // we want to the clan to just say they are not in a clan instead of being blank to avoide confusion
            var clan = 'Not in a clan';
          }
          
          // so i made one array for each of the fields just so i can read what is going to be on each line easily
          let main = [
            
            // this shows the players level
            // i am not sure but i think it shows one level above what it shows ingame for an unknown reason
            // i need to do more testing to find out
            `**Level:** ${p.Level}`,
            
            // this shows what there status/mood thing is
            `**Status:** ${p.Personal_Status_Message}`,
            
            // so i use the clantag from the name array here and get the clan name
            // for an unknown reason they refer to clans as teams in all the api stuff
            // maybe it is just to annoying people like me
            `**Clan:** ${clan}`,
            
            // this is not what region they registed on but the last region they selected when they were host of a party or solo queueing
            `**Region:** ${p.Region}`,
            
            // first it shows how many gods they have atleast mastery 1 on
            // then it shows the total of all of there masteries
            `**Mastery:** ${p.MasteryLevel} Gods, ${p.Total_Worshippers} total Worshippers`,
            
            // shows when the account was created to the second
            `**Account Created:** ${p.Created_Datetime}`,
            
            // shows when the account last logged in to the second
            `**Last Login:** ${p.Last_Login_Datetime}`,
            // shows how many achievements they have
            // not sure if it counts event ones or not
            `**Achievements:** ${p.Total_Achievements}`
          ];
          
          // the second field is all about winrates
          let winrate = [
            
            // this does the maths on what the players winrate is
            // i am not sure if i want to start rounding it or not because it shows 14 declimal places which is maybe too much
            `**Winrate:** ${parseInt(p.Wins) / (parseInt(p.Wins) + parseInt(p.Losses)) * 100}%`,
            
            // shows wins
            `**Wins:** ${p.Wins}`,
            
            // you will never guess what this shows
            // it shows losses, who would have known
            `**Losses:** ${p.Losses}`,
            
            // this is just here to shame people that rage quit a lot or have really bad internet
            `**Matches Left:** ${p.Leaves}`
          ];
          
          // now onto the last field, ranked stats
          // i am thinking of changing this to only show if people have a rank
          let ranked = [
            
            // all 3 are self explanatory as to what they are. it is just the rank of each of the gamemods
            // the smite api sends a number and not the actual rank so i use the rank array we made earlier
            // the numbers just work out nicely with unranked being 0 and masters being 26
            `**Conquest:** ${rankedTierArray[p.Tier_Conquest]}`,
            `**Duel:** ${rankedTierArray[p.Tier_Duel]}`,
            `**Joust:** ${rankedTierArray[p.Tier_Joust]}`
          ];
          
          // now we use the rank object to so we know what colour to make the embed
          // first we make an array with the users ranks
          let rankColour = [p.Tier_Conquest, p.Tier_Duel, p.Tier_Joust];
          
          // we change the array into a string. i think we can do that right?
          // first we get the highest rank using Math.max
          // then get what rank it would be equivalent to from the rank array
          // then we get what colour it is from the rank object
          rankColour = rankedTierObj[rankedTierArray[Math.max.apply(Math, rankColour)]];
          
          // so we are finally making the embed
          const playerEmbed = new Discord.RichEmbed()
          
            // set are setting the colour to the rank 
            .setColor(rankColour)
          
            // we are making the thumbnail the users avatar
            // this doesn't seem to be working because discord embeds can't try to display it but fails
            .setThumbnail(p.Avatar_URL)
          
            // we are using the array for the name becasuse it is clean
            // then we are just joining everything inside the main array with a newline
            .addField(name, main.join('\n'))
          
            // this is the winrate array
            .addField('Games', winrate.join('\n'))
          
            // and finally the ranked field which i may not have for everybody
            // we shall see
            .addField('Ranked', ranked.join('\n')); 
          
          // we are going to send the embed and return because we are done!
          return message.channel.send({embed: playerEmbed});
/*
    Mastery
*/
        } else if (search === "mastery") {
          let s = "s";
          if (args[0].substr(args[0].length - 1) === "s") s = "";
          const masteryEmbed = new Discord.RichEmbed()
            .setColor(settings.embedColour)
            .setTitle(`${args[0]}'${s} Masteries`);
          let number = args[1];
          if (!args[1]) number = 5;
          if (number > 19) number = 20;
          // console.log(Math.max.apply(Math, data.map(function(o){return o.Worshippers;})))
          
          for (var i=0; i < number; i++) {
            
          }
/*  
    God
*/
          
        } else if (search === "god") {
          
          // so the smite api sends an array of objects
          // each object is a different God
          // this allows us to search for the God we want
          // i might make an aliese thing later but i don't how what God alieses i should add
          const findGod = (searchGod) => {
            
            // if the name is equal to the argument (the God the user requested) then return
            return searchGod["Name"].toLowerCase() === args.join(' ').toLowerCase();
          }
          
          // so this will asign the Gods object to g
          // g is short for God if you didn't realise
          var g = data.find(findGod);
          
          // if the God is NOT in the array then just tell the user how dumb they are
          if (!g) return message.channel.send(`:negative_squared_cross_mark: \`${args.join(' ')}\` is not a God`);
          
          // so this is the main field
          let main = [
            
            // for some unknow reason HiRez are being trolls again. some (not all) of the strings start with a space
            // WHY
            // LIKE ACTUALL WHY DO YOU DO THIS
            // i could have modified the string but i chose to just remove the space but i chose to just remove the space between the * and the $
            // first what role the God has
            `**Role:**${g.Roles}`,
            
            // then what pantheon they are
            // this is the only string that doesn't start with a space
            `**Pantheon:** ${g.Pantheon}`,
            
            // attack type is ranged or melee AND magical or physical
            `**Attack Type:**${g.Type}`,
            
            // just shows what the God is good at
            // there is a section for cons but for all the Gods that i looked at, they were all plank
            // not sure what it is for
            `**Pros:**${g.Pros}`
          ];
          
          // so the string is either 'true' or ''
          // this is just the laziest way of doing this
          if (g.OnFreeRotation === "true") {
            
            // if it is true then add to the end of the main array
            main.push(`**Free Rotation:** Yes`);
          } else {
            
            // and if it is empty (not say true) then add this to the end of the array
            main.push(`**Free Rotation:** No`);
          }
          
          // if the God is the newest to the game it will have the value 'y'
          // unlike with OnFreeRotation this is either 'n' or 'y'
          // it is so inconsistent it hurts
          if (g.latestGod === "y") main.push(`Currently the newest God`);
          
          // i made a new array for a new field
          let abilities = [
            
            // they start with 1 instead of 0 because they are horrible people
            // this makes the ability numbers just wrong
            `**P:** ${g.Ability1}`,
            `**1:** ${g.Ability2}`,
            `**2:** ${g.Ability3}`,
            `**3:** ${g.Ability4}`,
            `**4:** ${g.Ability5}`
          ];
          
          // anther new field but this one is different to all the others
          // this one is an array of arrays because it is 2 fields in one
          // inside the array the first value is what the stat is and then the base value
          // the second value is how much is gained per level
          let stats = [
            [`**Attack Speed:** ${g.AttackSpeed}`, g.AttackSpeedPerLevel],
            [`**Health:** ${g.Health}`, g.HealthPerLevel],
            [`**HP5:** ${g.HealthPerFive}`, g.HP5PerLevel],
            [`**Mana:** ${g.Mana}`, g.ManaPerLevel],
            [`**MP5:** ${g.ManaPerFive}`, g.MP5PerLevel],
            [`**Magical Protection:** ${g.MagicProtection}`, g.MagicProtectionPerLevel],
            [`**Physical Protection:** ${g.PhysicalProtection}`, g.PhysicalProtectionPerLevel]
          ];
          
          // we need to check to see if they are a magical or physical damage dealer
          // we could use g.Type but we would have to modify the string and i am too lazy
          // physical damage dealers (assassins, hunter and warriors) would have a magical power of 0
          if (g.MagicalPower === 0) {
            
            // because only physical damage dealers are here we just add this to the stats array of arrays
            // it keeps the formula of base then per level
            stats.unshift([`**Physical Power:** ${g.PhysicalPower}`, g.PhysicalPowerPerLevel]);
          } else {
            
            // if they doesn't have a magical power of 0 then they must be a magical damage dealer
            // this is just the same as above but slightly differently worded and the values have changed
            stats.unshift([`**Magical Power:** ${g.MagicalPower}`, g.MagicalPowerPerLevel]);
          }
          
          // the path to get basic attack damage is weird
          // it has the same format as an ability
          // this gets the string in which the numbers are stored
          let basicDamage = g.basicAttack.itemDescription.menuitems[0].value;
          
          // the format of the number is werid, for expample agni is '34 + 1.5/Lvl (+20% of Magical Power)'
          // we have to manipulate the string to get the infomation we want
          // first we sperate the per level value from the '/Lvl'
          // we replace it with a space so that it can be split when we make it an array
          // next we do the splitting and make it an array
          basicDamage = basicDamage.replace('/', ' ').split(' ');
          
          // once it is an array we can add it to the stats array in the correct format
          // if we take the agni expample agian the array would be ['34', '+', '1.5', '/Lvl', '(+20%', 'of' 'Magical', 'Power)']
          // this makes the base damage's position 0 (arrays start at 0)
          // the scaling damage is position 4 but it also has a ( which we don't want so we are going to replace that with nothing
          // the last thing we need is how much is gained per level which is in position 2
          stats.push([`**Basic Damage:** ${basicDamage[0]} ${basicDamage[4].replace('(', '')}`, basicDamage[2]]);
          
          // now we are going to split the array into two sperate arrays
          // i made two empty arrays so we can easily add the base stats and the per level stats into two different fields
          let baseStats = [];
          let perLevel = [];
          
          // i looped through the stats and added each stat to the two different arrays
          for (let [base, level] of stats) {
            
            // this is adding it to base
            baseStats.push(base);
            
            // this is adding it to per level
            perLevel.push(level);
          }
          
          // this is where the embed is made
          const godEmbed = new Discord.RichEmbed()
          
            // so the colour changes according to what role the God is
            // first we need to get ride of the dam space at the start of the string
            // then we make the role all lowercase so we can use the roleObj we made above
            .setColor(roleObj[g["Roles"].replace(' ', '').toLowerCase()])
          
            // we want the thumbnail to be a picture of the god so that at a glance we know which God it is
            .setThumbnail(g.godIcon_URL)
          
            // this is where all the infomation from the main array is placed along with the name of the God and it's title
            .addField(`${g.Name} - ${g.Title}`, main.join('\n'))
          
            // now is the field for abilites
            .addField('Abilities', abilities.join('\n'))
          
            // this is where the base stats are
            // we take it from the new baseStats array that we made and looped the infomation into
            // i made it inline so that the base stats and per level stats will be next to each other
            .addField("Base Stats", baseStats.join('\n'), true)
          
            // this is also inline like the one above
            .addField("Per level", perLevel.join('\n'), true);
          
          // just going to send the embed and return
          return message.channel.send({embed: godEmbed});
/*
    Ability
*/
        } else if (search === "ability") {
          return message.channel.send('WIP');
/*
    Item
*/
        } else if (search === "item") {
          if (args.join(' ').toLowerCase() === "fatalis") return message.channel.send('aids');
          if (client.isInArray(itemArray, args.join(' ')) === true) {
            var filterItemArray = [];
              for (const item of data) {
                if (itemObj[args.join(' ')].length === 1) {
                  item.ItemDescription["Menuitems"].forEach(function(stat) {
                    if (stat.Description === itemObj[args.join(' ')][0]) filterItemArray.push(item.DeviceName);
                  });
                } else if (itemObj[args.join(' ')].length === 2) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1]) filterItemArray.push(item.DeviceName);
                } else if (itemObj[args.join(' ')].length === 4) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1] && item[itemObj[args.join(' ')][2]] === itemObj[args.join(' ')][3]) filterItemArray.push(item.DeviceName);
                } else if (itemObj[args.join(' ')].length === 6) {
                  if (item[itemObj[args.join(' ')][0]] === itemObj[args.join(' ')][1] && item[itemObj[args.join(' ')][2]] === itemObj[args.join(' ')][3] && item[itemObj[args.join(' ')][4]] === itemObj[args.join(' ')][5]) filterItemArray.push(item.DeviceName); 
                }
              }
            return message.channel.send(`**[${filterItemArray.length}] ${args.join(' ').toProperCase()}:**\n` + filterItemArray.sort().join(', '));
          } else {
            const findItemByName = (searchItem) => {
              return searchItem["DeviceName"].toLowerCase() === args.join(' ').toLowerCase();
            };
            var i = data.find(findItemByName);
            if (!i) return message.channel.send(`:negative_squared_cross_mark: \`${args.join(' ')}\` is not an item or a searchable term`);
            if (i.Type === "Item") {
              let stats = [];
              for (let stat of i.ItemDescription.Menuitems) {
                stats.push(`${stat.Value} ${stat.Description}`);
              }
              let main = [
                `**Stats:**\n${stats.join('\n')}`
              ];
              var child = client.searchArrayOfObjects(data, "ItemId", i.ChildItemId);
              var root = client.searchArrayOfObjects(data, "ItemId", i.RootItemId);
              if (i.StartingItem) {
                main.unshift(`**Item Tier:** Starter`);
                main.unshift(`**Price:** ${i.Price}`);
              } else {
                main.unshift(`**Item Tier:** ${i.ItemTier}`);
                if (i.ItemTier === 1) {
                  main.unshift(`**Price:** ${i.Price}`);
                } else if (i.ItemTier === 2) {
                  main.unshift(`**Price:** ${i.Price} (${child.Price})`);
                } else if (i.ItemTier === 3) {
                  main.unshift(`**Price:** ${i.Price} (${parseInt(child.Price) + parseInt(root.Price)})`);
                }
              }
              if (i.ItemDescription.SecondaryDescription !== "" && i.ItemDescription.SecondaryDescription !== null) {
                main.unshift(`**Effect:** ${i.ItemDescription.SecondaryDescription}`);
              } else if (i.ItemDescription.Description !== "" && i.ItemDescription.Description !== null) {
                main.unshift(`**Effect:** ${i.ItemDescription.Description}`);
              } else if (i.ShortDesc !== "" && i.ShortDesc !== null) {
                main.unshift(`**Effect:** ${i.ShortDesc}`);
              }
              const itemEmbed = new Discord.RichEmbed()
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, main.join('\n'));
              let colour;
              i.ItemDescription["Menuitems"].forEach(function(stat) {
                if (stat["Description"].split(' ').includes("Physical")) {
                  colour = '#ff0000';
                } else if (stat["Description"].split(' ').includes("Magical")) {
                  colour = '#0050ff';
                }
                if (!colour) colour = '#ff00ff';
                itemEmbed.setColor(colour)
              });
              return message.channel.send({embed: itemEmbed});
            } else if (i.Type === "Active") {
              let desc = i.ItemDescription["SecondaryDescription"].replace("<font color='#FFFF00'>", '').replace("</font>", '').split(' Cooldown - ');
              const relicEmbed = new Discord.RichEmbed()
                .setColor('#14ff00')
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, `**Effect:** ${desc[0]}\n**Cooldown:** ${desc[1]}`);
              return message.channel.send({embed: relicEmbed});
            } else if (i.Type === "Consumable") {
              const consumableEmbed = new Discord.RichEmbed()
                .setColor('#ff6400')
                .setThumbnail(i.itemIcon_URL)
                .addField(i.DeviceName, `**Effect:** ${i.ItemDescription.SecondaryDescription}\n**Cost:** ${i.Price}`);
              return message.channel.send({embed: consumableEmbed});
            }
          }
/*
    Friends
*/
        } else if (search === "friends") {
          
          // the smite api sends back an array of objects but we like it in an array this time
          // f is short for friends
          var f = data;
          
          // we are going to check if it is an actual player once again so we don't get lots of undefined errors
          if (!f) return message.channel.send(`:negative_squared_cross_mark: I could not find that player. Either \`${args[0]}\` is wrong or the profile is private`);
          
          // we are making a new array to store all the friends thats profiles aren't private
          let friendsArray = [];
          
          // we are looping through the array that the smite api sent and getting only the names
          for (let name of f) {
            
            // we are adding all the names that aren't private to the new array i made
            if (name.name !== "") friendsArray.push(name.name)
          }
          
          // now we are sending the newly looped array which has all the friends in it
          // note that the name is what the player sent and not the actual players name (maybe case differences)
          // this is because we don't want to make another call to the api just for the name to be case perfect
          // the length displayed is ALL of there friends and not just the ones that profiles aren't private
          // we are sending it as a code block and not an embed because embed fields have a 1024 charater limit and code blocks have 2048
          // not sure if the 2048 charater limit will be a problem, i don't have many friends :(
          // the code block lint is asciidoc just because it is easy and neat to send different colours for the title and number of friends
          return message.channel.send(`== ${args[0]} ==\n[Total Friends - ${f.length}]\n\n${friendsArray.join(', ')}`, {code: "asciidoc"});
        }
      }
    });
  }
  
/*
    not sure what to name this section section
*/
  
  // calls the testsession function which may or may not call the createsession function
  testSession();
  
  // just wait 1 second for the responses and stuff
  // .wait is a function from utl/function.js and NOT a vanilla js function
  await client.wait(1000);
  
  // just going to sort through the commands so we make the correct request
  if (search === "player") {
    
    // we are request the getplayer method and the parameter is the player name
    requestData("getplayer", args[0]);  
  } else if (search === "mastery") {  
    requestData("getgodranks", args[0]);
    
  // we bundled god and ability together because they use the same method
  } else if (search === "god" || search === "ability") {
    
    // the parameter will never change because i always want it in English
    requestData("getgods", "1");   
  } else if (search === "item") {
    requestData("getitems", "1");
  } else if (search === "friends") {
    requestData("getfriends", args[0]);
  }  
};

exports.cmdConfig = {
  name: "smite",
  aliases: ['smit'],
  description: "Work in progress",
  usage: "smite <command> [arguments]",
  type: "info"
};
