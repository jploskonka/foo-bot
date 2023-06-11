const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_TOKEN
})

async function main(args) {
  if(!args.message) {
    console.log('Request without message')
    return {}
  }

  const { text } = args.message
  const openai = new OpenAIApi(configuration)

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: text }
      ]
    })

    const { content } = completion.data.choices[0].message

    console.log(`For message: ${text}; Reply from GPT: ${content}`)
  } catch (err) {
    console.error(err)
  }

  return {"body": "OK"}
}

exports.main = main
