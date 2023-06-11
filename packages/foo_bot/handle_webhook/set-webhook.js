const TelegramBot = require('node-telegram-bot-api')

// use .env file from the root directory
require('dotenv').config({ path: "../../../.env" })

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN)
const webHookUrl = process.env.TELEGRAM_WEBHOOK_URL

bot.setWebHook(webHookUrl, {
  allowedUpdates: [],
  drop_pending_updates: true
})
  .then((hook) => {
    bot.getWebHookInfo(webHookUrl)
  .then(resp => {
    console.log(resp)
  })
})
