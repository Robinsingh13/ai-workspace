import {
  FiFolder,
  FiMessageSquare,
  FiDatabase,
  FiCheckSquare,
  FiGithub,
} from "react-icons/fi"

export default function Sidebar({
  activeTab,
  setActiveTab,
}) {
  const navItems = [
    {
      id: "chat",
      label: "AI Chat",
      icon: <FiMessageSquare />,
    },
    {
      id: "memory",
      label: "Memory",
      icon: <FiDatabase />,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <FiCheckSquare />,
    },
    {
      id: "repos",
      label: "Repositories",
      icon: <FiGithub />,
    },
  ]

  return (
    <div className="w-64 h-screen border-r border-white/10 bg-[#0f172a] p-5 flex flex-col">
      <div className="mb-10">
        <h1 className="text-2xl font-bold">
          AI Workspace
        </h1>

        <p className="text-sm text-gray-400">
          Autonomous Dev Agent
        </p>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setActiveTab(item.id)
            }
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition ${
              activeTab === item.id
                ? "bg-blue-600"
                : "hover:bg-white/10"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto text-xs text-gray-500">
        AI-native engineering workspace
      </div>
    </div>
  )
}