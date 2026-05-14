import { useState } from "react"
import axios from "axios"

export default function TaskBoard() {
  const [prompt, setPrompt] =
    useState("")

  const [tasks, setTasks] =
    useState([])

  const generateTasks = async () => {
    if (!prompt.trim()) return

    try {
      const res = await axios.post(
        "http://localhost:5000/tasks/generate",
        {
          prompt,
        }
      )

      setTasks(res.data.tasks)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-5">
        AI Task Planner
      </h2>

      {/* INPUT */}
      <div className="flex gap-3 mb-6">
        <input
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value)
          }
          placeholder="Describe feature..."
          className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={generateTasks}
          className="bg-blue-600 px-5 rounded-xl"
        >
          Generate
        </button>
      </div>

      {/* TASKS */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-white/5 p-4 rounded-xl"
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  )
}