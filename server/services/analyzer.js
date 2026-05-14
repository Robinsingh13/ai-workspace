import fs from 'fs'
import path from 'path'

export const analyzeCodebase = (repoPath) => {
  const files = fs.readdirSync(repoPath)

  const structure = files.map((file) => ({
    name: file,
    type: fs.statSync(path.join(repoPath, file)).isDirectory()
      ? 'folder'
      : 'file',
  }))

  return {
    totalFiles: files.length,
    structure,
    frameworkGuess: 'React / Node (heuristic)',
  }
}