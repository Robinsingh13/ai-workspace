export const generateTasks = async (prompt, openai) => {
  const res = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "Break software feature into step-by-step engineering tasks.",
      },
      { role: "user", content: prompt },
    ],
  })

  return res.choices[0].message.content.split("\n")
}