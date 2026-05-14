import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import OpenAI from "openai"

import simpleGit from "simple-git"
import fs from "fs"
import path from "path"

import {
  getMemory,
  saveMemory,
} from "./memory/memoryStore.js"

import {
  createEmbedding,
  saveVectorMemory,
  searchMemory,
} from "./memory/vectorMemory.js"

import {
  createProject,
  getProjects,
} from "./projects/projectStore.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/* -----------------------------------
   MEMORY CLASSIFIER
----------------------------------- */

const classifyMemory = async (text) => {
  try {
    const res =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",

        messages: [
          {
            role: "system",
            content: `
Classify this memory into one category only:

- bug
- task
- decision
- architecture
- general

Return only category name.
            `,
          },

          {
            role: "user",
            content: text,
          },
        ],
      })

    return res.choices[0].message.content
      .trim()
      .toLowerCase()
  } catch (error) {
    console.log(error)

    return "general"
  }
}

/* -----------------------------------
   PROJECT API
----------------------------------- */

app.post("/projects", (req, res) => {
  try {
    const { name } = req.body

    const project =
      createProject(name)

    res.json(project)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error:
        "Failed to create project",
    })
  }
})

app.get("/projects", (req, res) => {
  try {
    const projects =
      getProjects()

    res.json(projects)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error:
        "Failed to fetch projects",
    })
  }
})

/* -----------------------------------
   CHAT API (STREAMING + MEMORY)
----------------------------------- */

app.post("/chat", async (req, res) => {
  try {
    const { message, projectId } = req.body

    /* -----------------------------------
       CREATE EMBEDDING
    ----------------------------------- */

    const queryEmbedding =
      await createEmbedding(message)

    /* -----------------------------------
       SEARCH RELEVANT MEMORIES
    ----------------------------------- */

    const relevantMemories =
      searchMemory(queryEmbedding)

    const memoryText = relevantMemories
      .map((m) => `[${m.type}] ${m.text}`)
      .join("\n")

    /* -----------------------------------
       STREAM HEADERS
    ----------------------------------- */

    res.setHeader(
      "Content-Type",
      "text/plain"
    )

    res.setHeader(
      "Transfer-Encoding",
      "chunked"
    )

    /* -----------------------------------
       STREAM AI RESPONSE
    ----------------------------------- */

    const stream =
      await openai.chat.completions.create({
        model: "gpt-4.1-mini",

        stream: true,

        messages: [
          {
            role: "system",
            content: `
You are an AI software engineering assistant.

Relevant Project Memory:
${memoryText}

Use previous engineering context when useful.
            `,
          },

          {
            role: "user",
            content: message,
          },
        ],
      })

    let fullReply = ""

    for await (const chunk of stream) {
      const content =
        chunk.choices[0]?.delta?.content || ""

      fullReply += content

      res.write(content)
    }

    /* -----------------------------------
       SAVE MEMORY
    ----------------------------------- */

    await saveMemory(
      projectId,
      {
        role: "user",
        text: message,
      },
      classifyMemory
    )

    await saveMemory(
      projectId,
      {
        role: "assistant",
        text: fullReply,
      },
      classifyMemory
    )

    /* -----------------------------------
       SAVE VECTOR MEMORY
    ----------------------------------- */

    saveVectorMemory(
      {
        text: message,
        type: "user",
      },
      queryEmbedding
    )

    res.end()
  } catch (error) {
    console.log(error)

    res.status(500).end(
      "Something went wrong"
    )
  }
})

/* -----------------------------------
   MEMORY API
----------------------------------- */

app.get("/memory/:projectId", (req, res) => {
  try {
    const { projectId } = req.params

    const memories =
      getMemory(projectId)

    res.json(memories)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error:
        "Failed to fetch memories",
    })
  }
})

/* -----------------------------------
   TASK GENERATOR API
----------------------------------- */

app.post(
  "/tasks/generate",
  async (req, res) => {
    try {
      const { prompt } = req.body

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4.1-mini",

          messages: [
            {
              role: "system",
              content: `
You are a senior software architect.

Break software features into:
- backend tasks
- frontend tasks
- database tasks
- deployment tasks

Return concise engineering tasks only.
              `,
            },

            {
              role: "user",
              content: prompt,
            },
          ],
        })

      const tasks =
        completion.choices[0].message.content
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean)

      res.json({
        tasks,
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        error:
          "Task generation failed",
      })
    }
  }
)

/* -----------------------------------
   REPO ANALYZER API
----------------------------------- */

app.post(
  "/repo/analyze",
  async (req, res) => {
    try {
      const { repoName } = req.body

      const repoUrl =
        repoName.trim()

      const repoFolder =
        repoUrl
          .split("/")
          .pop()
          .replace(".git", "")

      const localPath = path.join(
        "repos",
        repoFolder
      )

      /* -----------------------------------
         CLONE REPO
      ----------------------------------- */

      if (!fs.existsSync(localPath)) {
        await simpleGit().clone(
          repoUrl,
          localPath
        )
      }

      /* -----------------------------------
         READ PACKAGE.JSON
      ----------------------------------- */

      const packagePath = path.join(
        localPath,
        "package.json"
      )

      if (!fs.existsSync(packagePath)) {
        return res.status(400).json({
          error:
            "No package.json found",
        })
      }

      const packageJson = JSON.parse(
        fs.readFileSync(packagePath, "utf8")
      )

      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      }

      /* -----------------------------------
         DETECT FRAMEWORK
      ----------------------------------- */

      let framework = "Unknown"

      if (deps.react)
        framework = "React"

      if (deps.next)
        framework = "Next.js"

      if (deps.vue)
        framework = "Vue"

      /* -----------------------------------
         DETECT STYLING
      ----------------------------------- */

      let styling = "Unknown"

      if (deps.tailwindcss)
        styling = "Tailwind CSS"

      if (deps["styled-components"])
        styling =
          "Styled Components"

      /* -----------------------------------
         DETECT ARCHITECTURE
      ----------------------------------- */

      let architecture =
        "Standard JavaScript Architecture"

      if (
        fs.existsSync(
          path.join(localPath, "src")
        )
      ) {
        architecture =
          "Component-based architecture"
      }

      /* -----------------------------------
         AI ANALYSIS
      ----------------------------------- */

      const completion =
        await openai.chat.completions.create({
          model: "gpt-4.1-mini",

          messages: [
            {
              role: "system",
              content:
                "Analyze software repository architecture.",
            },

            {
              role: "user",
              content: `
Framework: ${framework}

Styling: ${styling}

Dependencies:
${Object.keys(deps).join(", ")}

Architecture:
${architecture}
              `,
            },
          ],
        })

      const recommendation =
        completion.choices[0].message.content

      /* -----------------------------------
         RESPONSE
      ----------------------------------- */

      res.json({
        framework,
        styling,
        architecture,
        recommendation,
      })
    } catch (error) {
      console.log(error)

      res.status(500).json({
        error:
          "Repo analysis failed",
      })
    }
  }
)

/* -----------------------------------
   START SERVER
----------------------------------- */

app.listen(5000, () => {
  console.log(
    "Server running on port 5000"
  )
})