import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const understandRepo = async (fileTree) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a senior software architect analyzing codebases.',
      },
      {
        role: 'user',
        content: `Analyze this project structure:
${JSON.stringify(fileTree)}`,
      },
    ],
  })

  return completion.choices[0].message.content
}