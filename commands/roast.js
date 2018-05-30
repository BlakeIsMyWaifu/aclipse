exports.run = (client, message, args) => {
  let user = message.mentions.users.first() || message.author;
  let n = user.username;
  let name = user.username.substr(user.username.length - 1) === "s" ? user.username + "'" : user.username + "'s";
  let roast = [
    `${user.avatarURL}`,
    `${name} mums gay`,
    `${n} is the reason the gene pool needs a lifeguard`,
    `${n} looks like they work as a balloon for kids birthday parties`,
    `${n} looks like their mum let them try thier first beer through an umbilical cord`,
    `${name} head shape is a trapezoid`,
    `${n} has got the personality of a snowmobile - lifeless, but always wants to be ridden`,
    `${name} arse must be pretty jealous of all the shit that comes out of thier mouth`,
    `if laughter is the best medicine, ${name} face must be curing the world`,
    `${n} is so ugly they scare the crap out of toilets`,
    `${name} family tree must be a cactus because everybody on it is a prick`,
    `${n} is as useful as Anne Framk's drum set`,
    `God wasted a good arsehole when he put teeth in ${name} mouth`,
    `People like ${n} are the reason God doesn't talk to us anymore`,
    `${name} face looks like thier face was on fire and someone tried to put it out with an ice pick`,
    `I can't tell if ${name} face has acne or marks from the hanger`,
    `${n} is kinda like Rapunzel except instead of letting down thier hair they let down everybody in thier life`,
    `I wonder if ${name} would be able to speak more clearly if thier parents were second cousins instead of first`,
    `${n} isn't the dumbest person on the planet, but they sure hope he doesn't die`,
    `Nobody has the time nor the crayons to explain things to ${n}`,
    `I am not saying ${n} is fat but it looks like they were poured into thier cloths and forgot to say when`,
    `${name} familty tree must be a circle`,
    `If the pope saw ${n} then he would immediately allow Catholics to wear condoms`,
    `Who needs April fools when ${name} whole life is a joke`
  ];
  return message.channel.send(roast.random());
};

exports.cmdConfig = {
  name: "roast",
  aliases: [],
  description: "Roasts a user.",
  usage: "<@user>",
  type: "fun",
  permission: null
};
