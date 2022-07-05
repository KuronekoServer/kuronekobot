const cron = require('node-cron')
const logger = require("../modules/logger")
const config = require("../utils/get-config");

module.exports = (client) => {
      client.user.setActivity(config.prefix + 'help' + ' | KuronekoServer', {type: 'PLAYING'});
    // 定期的にステータスを変えてみる
    cron.schedule('0 0 1 * * *', () => {
        client.user.setActivity(config.prefix + 'help' + ' | すやすや', {type: 'PLAYING'});
      })
      cron.schedule('0 0 6 * * *', () => {
        client.user.setActivity(config.prefix + 'help' + ' | KuronekoServer', {type: 'PLAYING'});
      })
      cron.schedule('0 0 12 * * *', () => {
        client.user.setActivity(config.prefix + 'help' + ' | ごはんもぐもぐ', {type: 'PLAYING'});
      })  
      cron.schedule('0 30 12 * * *', () => {
        client.user.setActivity(config.prefix + 'help' + ' | KuronekoServer', {type: 'PLAYING'});
      })
}