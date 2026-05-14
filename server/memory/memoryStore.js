const memory = {}


export const saveMemory = async (projectId, item, classifyMemory) => {
  if (!memory[projectId]) {
    memory[projectId] = []
  }

  // 🔥 STEP 21 — classify memory type
  const type = await classifyMemory(item.text)

  memory[projectId].push({
    id: Date.now(),
    timestamp: new Date().toISOString(),
    type, // bug / task / decision / architecture
    ...item,
  })
}

export const getMemory = (projectId, type = null) => {
  const data = memory[projectId] || []

  if (type) {
    return data.filter((m) => m.type === type)
  }

  return data
}