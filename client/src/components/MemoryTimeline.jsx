import { useEffect, useState } from "react"
import axios from "axios"

export default function MemoryTimeline() {
  const [memories, setMemories] = useState([])

  const fetchMemories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/memory/project-1"
      )

      setMemories(res.data.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMemories()

    const interval = setInterval(() => {
      fetchMemories()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-80 border-l border-white/10 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-5">
        Memory Timeline
      </h2>

      <div className="space-y-4">
        {memories.map((m) => (
          <div
            key={m.id}
            className="bg-white/5 p-4 rounded-xl"
          >
            <p className="text-xs uppercase text-blue-400 mb-2">
              {m.type}
            </p>

            <p className="text-sm">
              {m.text}
            </p>

            <p className="text-[10px] text-gray-500 mt-2">
              {new Date(
                m.timestamp
              ).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}