import {
  useEffect,
  useState,
} from "react"

import axios from "axios"

export default function ProjectSidebar({
  activeProject,
  setActiveProject,
}) {
  const [projects, setProjects] =
    useState([])

  const [newProject, setNewProject] =
    useState("")

  /* -----------------------------
     FETCH PROJECTS
  ------------------------------ */

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/projects"
      )

      setProjects(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  /* -----------------------------
     CREATE PROJECT
  ------------------------------ */

  const createProject = async () => {
    if (!newProject.trim()) return

    try {
      const res = await axios.post(
        "http://localhost:5000/projects",
        {
          name: newProject,
        }
      )

      setProjects((prev) => [
        ...prev,
        res.data,
      ])

      setNewProject("")
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-72 border-r border-white/10 p-4">
      <h2 className="text-2xl font-bold mb-5">
        Projects
      </h2>

      {/* CREATE */}
      <div className="flex gap-2 mb-5">
        <input
          value={newProject}
          onChange={(e) =>
            setNewProject(e.target.value)
          }
          placeholder="New project"
          className="flex-1 bg-white/10 rounded-xl px-3 py-2 outline-none"
        />

        <button
          onClick={createProject}
          className="bg-blue-600 px-4 rounded-xl"
        >
          +
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-2">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() =>
              setActiveProject(
                project.id
              )
            }
            className={`w-full text-left p-3 rounded-xl ${
              activeProject ===
              project.id
                ? "bg-blue-600"
                : "bg-white/5"
            }`}
          >
            {project.name}
          </button>
        ))}
      </div>
    </div>
  )
}