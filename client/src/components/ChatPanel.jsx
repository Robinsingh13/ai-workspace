import { useState } from "react"
import axios from "axios"

export default function ChatPanel() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

  const sendMessage = async () => {
  if (!message.trim()) return

  const updated = [
    ...messages,
    {
      role: "user",
      text: message,
    },
  ]

  setMessages(updated)

  const currentMessage = message

  setMessage("")

  /* -----------------------------
     EMPTY AI MESSAGE
  ------------------------------ */

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      text: "",
    },
  ])

  const response = await fetch(
    "http://localhost:5000/chat",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        message: currentMessage,
        projectId: "project-1",
      }),
    }
  )

  const reader =
    response.body.getReader()

  const decoder = new TextDecoder()

  let done = false
  let aiText = ""

  while (!done) {
    const result =
      await reader.read()

    done = result.done

    const chunk =
      decoder.decode(result.value || new Uint8Array())

    aiText += chunk

    setMessages((prev) => {
      const copy = [...prev]

      copy[copy.length - 1] = {
        role: "assistant",
        text: aiText,
      }

      return copy
    })
  }
}

  return (
    <div className="flex-1 flex flex-col">
      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-4 rounded-xl max-w-2xl ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="p-4 border-t border-white/10 flex gap-3">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask AI to analyze project..."
          className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-6 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  )
}