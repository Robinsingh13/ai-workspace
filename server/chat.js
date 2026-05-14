app.post('/chat', async (req, res) => {
  const { message, projectId } = req.body

  // 🔥 HERE (STEP 20)
  const previousMemory = getMemory(projectId)
  const memoryText = previousMemory
    .slice(-20)
    .map(m => `[${m.type}] ${m.text}`)
    .join('\n')

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [
      {
        role: 'system',
        content: `
You are an AI software engineering assistant.

Previous Memory:
${memoryText}
        `,
      },
      {
        role: 'user',
        content: message,
      },
    ],
  })
})