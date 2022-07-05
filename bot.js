const logger = require('./src/modules/logger')
logger.debug("Starting Logger.... Done!")
logger.debug('Starting System...')

// モジュールの読み込み
const { Client, Intents, Collection, MessageEmbed} = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_PRESENCES] });
const fs = require("fs");
client.commands = new Collection();
logger.debug("module loading... Done!");

// configあるかたしかめる
if( fs.existsSync("./configs/config.json") ){
  logger.debug( "configが設定されています...");
}else{
      logger.error("configファイルがありません (config not found) \n ./configs/sample_config.jsonをもとに ./configs/config.json を作成してください")
      logger.error("Error: ENOENT: no such file or directory, open configs/config.json")
      return;
}

const config = require('./src/utils/get-config.js');
logger.debug("config Load ... Done!")

// ファイルの読み込み
const events = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./src/events/${file}`);
  client.on(eventName, event.bind(null, client));
  logger.debug(`Loading event: ${eventName}`)
}
logger.debug("All Loading event... Done!")

const commands = fs.readdirSync("./src/commands").filter(file => file.endsWith(".js"));
for (const file of commands) {
  const commandName = file.split(".")[0];
  const command = require(`./src/commands/${file}`);

  client.commands.set(commandName, command);
  logger.debug(`Loading command: ${commandName}`);
}
logger.debug("All Loading command... Done!")

// slash command
// 一旦消す
/*
const slashFiles = fs.readdirSync("./src/slash").filter(file => file.endsWith(".js"));
for (const file of slashFiles) {
  const command = require(`./src/slash/${file}`);
  const commandName = file.split(".")[0];
  logger.debug(`Loading slash command: ${commandName}`);
  
  // Now set the name of the command with it's properties.
  client.container.slashcmds.set(command.commandData.name, command);
}
logger.debug("All Loading Slash command... Done!")
*/

// Discord login
client.login(config.token).catch(err => logger.error(err));
logger.debug('Starting System... Done!')

// ログを表示
require("./src/modules/info-logger")