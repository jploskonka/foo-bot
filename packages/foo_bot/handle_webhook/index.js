// use .env file from the root directory
require('dotenv').config({ path: "../../../.env" })

const TelegramBot = require('node-telegram-bot-api')
const { Configuration, OpenAIApi } = require('openai')
const StatsD = require('hot-shots')

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_TOKEN
})

const stats = new StatsD({
  host: process.env.STATSD_HOST,
  port: process.env.STATSD_PORT,
  prefix: `${process.env.GRAPHITE_API_KEY}.handle_webhook.`
})

async function main(args) {
  const startTime = new Date()
  stats.increment('invocations')

  if(!args.message) {
    console.log('Request without message')
    return {}
  }

  const { text } = args.message
  const openai = new OpenAIApi(configuration)

  try {
    const completionStartTime = new Date()
    stats.increment('openai_api_requests')

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: text }
      ]
    })
    stats.timing('openai_api_response_time', completionStartTime)

    const { content } = completion.data.choices[0].message
    const { chat } = args.message

    await bot.sendMessage(chat.id, content)
    stats.increment('telegram_messages')

    console.log(`For message: ${text}; Reply from GPT: ${content}`)
  } catch (err) {
    stats.increment('errors')
    console.error(err)
  }

  stats.increment('successes')
  stats.timing('total_time', startTime)
  return {"body": "OK"}
}

exports.main = main
