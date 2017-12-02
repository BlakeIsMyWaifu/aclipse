exports.run = async (client, message, args) => {
  if (message.author.id !== client.config.ownerId) return;
  if (!args || args.size < 1) return message.channel.send(':negative_squared_cross_mark: Must provide a command to reload.');
  let response = await client.unloadCommand(args[0]);
  if (response) return message.channel.send(`:negative_squared_cross_mark: Error Unloading: ${response}`);
  response = client.loadCommand(args[0]);
  if (response) return message.channel.send(`:negative_squared_cross_mark: Error Loading: ${response}`);
  message.channel.send(`:white_check_mark: The command \`${args[0]}\` has been reloaded`);
};

exports.cmdConfig = {
  name: "reload",
  aliases: [],
  description: "Reloads the command file, if it's been updated or modified.",
  usage: "reload <commandname>",
  type: "client"
};
