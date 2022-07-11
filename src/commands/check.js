const logger = require('../modules/logger')
const config = require('../utils/get-config');
const notadmin = require('../utils/not-admin');
const profileModel = require('../utils/Schema/ProfileSchema');
const { MessageEmbed } = require('discord.js');
const BlockUserModel = require('../utils/Schema/BlockUserSchema');
const err_embed = require('../utils/error-embed')

exports.run = (client, message, args) => {
    try {
        async function run(){
            // 権限の確認
            var syslog = new MessageEmbed({
                title: "権限がない人が `check` コマンドを実行しました`",
                description: "このメッセージはBot管理者でない人が評価しようとしたため送信します",
                fields: [{
                        name: "ユーザーID",
                        value: message.author.id
                    },
                ]
            })
        
        
            if (! config.bot.owner.includes(message.author.id)){
                message.channel.send({embeds: [notadmin.embed]})
                // ログとして送信
                client.channels.cache.get(config.syslog).send({embeds: [syslog]})
                logger.warn("権限のない人が check コマンドを実行しました")
                return;
            }


            const args = message.content.split(" ").slice(1);
            const input = args.join(" ")

            // ユーザーIDが指定されていない場合
            var err_argument = new MessageEmbed({
                title: "prefixのreset",
                description: "コマンド実行エラー: 引数が指定されていません",
                color: 16601703,
                fields: [
                    {
                        name: "コマンド実行に必要な引数",
                        value: "`check 【リセットするユーザーID】`"
                    },
                    {
                        name: "実行例: ",
                        value: "`check 927919368665456710`"
                    },
                ]
            })

            if(!input){
                message.reply({ embeds: [err_argument]})
                return;
            }

            const profileData = await profileModel.findOne({ _id: input });

            if (!profileData) {
                message.channel.send(({embeds: [err_embed.main]}))
                message.channel.send("エラー: ユーザープロファイルが見つかりませんでした")
                logger.error("ユーザーID: " + input + " のプロファイルを確認しようとしましたがプロファイルデータがありませんでした...")
                return;
            }
        
            // block profileの確認
            const BlockData = await BlockUserModel.findOne({ _id: input });
            if (!BlockData) {
                message.channel.send(({embeds: [err_embed.main]}))
                message.channel.send("エラー: ユーザーブロックプロファイルが見つかりませんでした")
                logger.error("ユーザーID: " + input + " のブロックプロファイルを確認しようとしましたがプロファイルデータがありませんでした...")
                return;
            }

            var data = new MessageEmbed({
                title: "ユーザー情報確認",
                description: "DBに保存されているデータを取得しました",
                color: 3853014,
                timestamp: new Date(),
                thumbnail: {
                    url: profileData.avatar
                },
                fields: [
                    {
                        name: "ユーザー基本情報",
                        value: "DBに保存されている基本的なデータを表示します",
                    },
                    {
                        name: "ユーザーID: ",
                        value: "`"+ input + "`",
                        inline: true
                    },
                    {
                        name: "ユーザー名: ",
                        value: "`"+ profileData.name + "`",
                        inline: true
                    },
                    {
                        name: "ユーザー設定情報",
                        value: "DBに保存されている設定情報を表示します",
                    },
                    {
                        name: "prefix: ",
                        value: "`"+ profileData.prefix + "`",
                        inline: true
                    },
                    {
                        name: "ユーザーブロック情報",
                        value: "DBに保存されているブロック情報を表示します",
                    },
                    {
                        name: "ブロックの有無",
                        value: "`"+ BlockData.enable+ "`",
                        inline: true
                    },
                    {
                        name: "ハードブロックの有無",
                        value: "`"+ BlockData.hardblock+ "`",
                        inline: true
                    },
                ]
            })
            message.channel.send(({embeds: [data]}))
        }

        run()
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

exports.name = "check";