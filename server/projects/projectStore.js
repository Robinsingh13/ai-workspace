const projects = []

export const createProject = (
  name
) => {
  const project = {
    id: Date.now().toString(),
    name,
    createdAt:
      new Date().toISOString(),
  }

  projects.push(project)

  return project
}

export const getProjects = () => {
  return projects
}