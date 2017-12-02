exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.ownerId) return;
  const code = args.join(" ");
  try {
    const evaled = eval(code);
    const clean = await client.clean(client, evaled);
    message.channel.send(`\`\`\`js\n${clean}\n\`\`\``);
  } catch (err) {
    message.channel.send(`\`ERROR\` \`\`\`xl\n${await client.clean(client, err)}\n\`\`\``);
  }
};

exports.cmdConfig = {
  name: "eval",
  aliases: [],
  description: "Evaluates arbitrary Javascript.",
  usage: "eval <expression>",
  type: "client"
};
