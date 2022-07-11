const { MessageEmbed } = require('discord.js');
const package = require('../../package.json');
const logger = require('../modules/logger')
const config = require('../utils/get-config');
const sleep = require('../modules/sleep')
const notadmin = require('../utils/not-admin');
const err_embed = require('../utils/error-embed')

exports.run = (client, message, args) => {
    try{
        var syslog = new MessageEmbed({
            title: "権限がない人がコマンドを実行しようとしました",
            description: "このメッセージはBotownerでない人が実行しようとしたため送信します",
            fields: [{
                    name: "ユーザーID",
                    value: message.author.id
                },
            ]
        })
    
        if(!config.command_settings.shutdown.includes("true")){
            return;
        }

        if (! config.bot.owner.includes(message.author.id)){
            message.channel.send({embeds: [notadmin.embed]})
            // ログとして送信
            client.channels.cache.get(config.syslog).send({embeds: [syslog]})
            logger.warn("権限のない人が管理コマンドを実行しました")
            return;
        }
    
        if ( config.bot.owner.includes(message.author.id)){
            sleep(4000)
            logger.info("Stopping System...")
            process.exit(0)
        }
    } catch (err) {
            logger.error("コマンド実行エラーが発生しました")
            logger.error(err)
            message.channel.send(({embeds: [err_embed.main]}))
            if(config.debug.enable.includes("true")){
                message.channel.send(({embeds: [err_embed.debug]}))
                message.channel.send("エラー内容: ")
                message.channel.send("```\n"+ err + "\n```")
            }
    }
}

exports.name = "shutdown";