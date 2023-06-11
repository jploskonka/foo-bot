// index.js
function main(args) {
  if(args.message) {
    console.log(`message received with text: ${args.message.text}`)
    return {"body": "OK"}
  }

  return {}
}

exports.main = main
