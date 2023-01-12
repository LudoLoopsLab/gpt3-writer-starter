import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

const basePromptPrefix = "convert the  url to an markdown link: "
// const secondPrompt = 'use the word from the array to write, make a markdown title, write a small description with them'
const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  })

  const basePromptOutput = baseCompletion.data.choices.pop()

  console.log('basePromptOutput', basePromptOutput.text)
  const secondPrompt =
    `
  use the word from the array:  ${req.body.userInput}
  to write, make a markdown title, on a new line write a small description with them.
  then put this link: ${basePromptOutput.text} below.
  `

  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.7,
    // I also increase max_tokens.
    max_tokens: 250,
  })

  // Get the output

  const secondPromptOutput = secondPromptCompletion.data.choices.pop()

  res.status(200).json({ output: secondPromptOutput })
}

export default generateAction