const config = require('../utils/get-config');
const { MessageEmbed } = require('discord.js');
const logger = require('../modules/logger')
logger.debug("Load message Create Event")

module.exports = (client, message) => {
    // Ignore bots
    if (message.author.bot) return;
    
    // Ignore messages not starting with the prefix
    if (message.content.indexOf(config.prefix) !== 0) return;
  
    // Our standard argument/command name definition.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
  
    // Grab the command data from the client.commands Enmap
    const cmd = client.commands.get(command);
  
    // If that command doesn't exist, silently exit and do nothing
    if (!cmd) return;
  
    // Run the command
    cmd.run(client, message, args);
  };