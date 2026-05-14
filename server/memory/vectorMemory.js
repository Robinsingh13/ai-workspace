import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const vectorMemory = []

/* -----------------------------------
   CREATE EMBEDDING
----------------------------------- */

export const createEmbedding =
  async (text) => {
    const res =
      await openai.embeddings.create({
        model:
          "text-embedding-3-small",

        input: text,
      })

    return res.data[0].embedding
  }

/* -----------------------------------
   SAVE VECTOR MEMORY
----------------------------------- */

export const saveVectorMemory = (
  item,
  embedding
) => {
  vectorMemory.push({
    ...item,
    embedding,
  })
}

/* -----------------------------------
   COSINE SIMILARITY
----------------------------------- */

const cosineSimilarity = (
  a,
  b
) => {
  let dot = 0
  let magA = 0
  let magB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]

    magA += a[i] * a[i]

    magB += b[i] * b[i]
  }

  return (
    dot /
    (Math.sqrt(magA) *
      Math.sqrt(magB))
  )
}

/* -----------------------------------
   SEARCH MEMORY
----------------------------------- */

export const searchMemory = (
  queryEmbedding
) => {
  return vectorMemory
    .map((m) => ({
      ...m,

      score: cosineSimilarity(
        queryEmbedding,
        m.embedding
      ),
    }))

    .sort((a, b) => b.score - a.score)

    .slice(0, 5)
}