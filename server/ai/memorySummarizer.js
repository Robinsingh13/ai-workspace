export const summarizeMemory = async (memories, openai) => {
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content:
          'Summarize software engineering project memory into key insights.',
      },
      {
        role: 'user',
        content: JSON.stringify(memories),
      },
    ],
  })

  return res.choices[0].message.content
}