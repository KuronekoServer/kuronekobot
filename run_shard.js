const { ShardingManager } = require('discord.js');
const logger = require('./src/modules/logger')
const config = require('./src/utils/get-config')

const manager = new ShardingManager('./bot.js', { token: config.token });

manager.on('shardCreate', shard => logger.info(`Launched shard ${shard.id}`));
manager.spawn();
