const logger = require('../modules/logger')
const config = require('../utils/get-config');
const notadmin = require('../utils/not-admin');
const profileModel = require('../utils/Schema/ProfileSchema');
const { MessageEmbed } = require('discord.js');
const err_embed = require('../utils/error-embed')

exports.run = (client, message, args) => {
    try {
        async function run(){
            // 権限の確認
            var syslog = new MessageEmbed({
                title: "権限がない人が `prefix-reset` コマンドを実行しました`",
                description: "このメッセージはBot管理者でない人が評価しようとしたため送信します",
                fields: [{
                        name: "ユーザーID",
                        value: message.author.id
                    },
                ]
            })
        
            if (!config.owner.includes(message.author.id)){
                message.channel.send({embeds: [notadmin.embed]})
                // ログとして送信
                client.channels.cache.get(config.syslog).send({embeds: [syslog]})
                logger.warn("権限のない人が prefix-reset コマンドを実行しました")
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
                        value: "`prefix-reset 【リセットするユーザーID】`"
                    },
                    {
                        name: "実行例: ",
                        value: "`prefix-reset 927919368665456710`"
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
                message.channel.send("ユーザープロファイルが見つかりませんでした")
                logger.error("ユーザーID: " + input + " のprefixを設定しようとしましたがプロファイルデータがありませんでした...")
                return;
            }
        

            // データを設定
            await profileData.updateOne({
                prefix: config.prefix,
            })

            var success = new MessageEmbed({
                title: "prefixのリセット",
                description: "prefix(接頭辞)をリセットしました",
                color: 3853014,
                fields: [
                    {
                        name: "リセットしたユーザー",
                        value: "`"+ input + "`"
                    },
                    {
                        name: "設定したprefix",
                        value: "`"+ config.prefix + "`"
                    },
                ]
            })
            message.channel.send(({embeds: [success]}))
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

exports.name = "prefix-reset";