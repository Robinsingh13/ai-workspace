export default function TaskPanel() {
  const tasks = [
    'Setup authentication',
    'Create dashboard UI',
    'Add memory retrieval',
    'Implement repo analyzer',
  ]

  return (
    <div className="w-72 border-l border-white/10 p-4">
      <h2 className="text-xl font-semibold mb-4">
        Tasks
      </h2>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="bg-white/5 p-3 rounded-xl"
          >
            {task}
          </div>
        ))}
      </div>
    </div>
  )
}