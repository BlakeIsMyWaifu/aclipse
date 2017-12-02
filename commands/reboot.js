exports.run = async (client, message) => {
  await message.channel.send(":white_check_mark: Bot is shutting down.");
  client.commands.forEach( async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit(1);
};

exports.cmdConfig = {
  name: "reboot",
  aliases: ['restart'],
  description: "Turns off the bot.",
  usage: "reboot",
  type: "client"
};
