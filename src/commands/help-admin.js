const { MessageEmbed } = require('discord.js');
const logger = require('../modules/logger')
const config = require('../utils/get-config')
const err_embed = require('../utils/error-embed')

exports.run = (client, message, args) => {
    try{
        const prefix =  config.bot.prefix
        var embed = new MessageEmbed({
            title: "help-admin",
            description: "このコマンドはbot管理者のみ実行可能です",
            color: 0xffff12,
            fields: [
                {
                    name: prefix + "shell [実行するshellコマンド]",
                    value: "shellコマンドを実行します"
                },
                {
                    name: prefix + "eval [評価するコード]",
                    value: "JavaScriptコードを評価,実行します"
                },
                {
                    name: prefix + "shutdown",
                    value: "botをシャットダウンします"
                },
                {
                    name: prefix + "reload [コマンド名]",
                    value: "コマンドをリロードします(開発用コマンド)"
                },
            ]
        })
        message.channel.send({embeds: [embed]})
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

exports.name = "help-admin";