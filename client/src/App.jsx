import Sidebar from './components/Sidebar'
import ChatPanel from './components/ChatPanel'
import MemoryTimeline from './components/MemoryTimeline'
import TaskBoard from './components/TaskBoard'

export default function App() {
  return (
    <div className="h-screen flex bg-[#0b0f19] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex">
          <ChatPanel />
          <MemoryTimeline />
        </div>

        <div className="border-t border-white/10">
          <TaskBoard />
        </div>
      </div>
    </div>
  )
}