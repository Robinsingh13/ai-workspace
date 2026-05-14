import { useState } from 'react'
import axios from 'axios'

export default function RepoUploader() {
  const [repo, setRepo] = useState('')
  const [result, setResult] = useState(null)

  const analyzeRepo = async () => {
    const res = await axios.post('http://localhost:5000/repo/analyze', {
      repoName: repo,
    })

    setResult(res.data)
  }

  return (
    <div className="p-4">
      <h2 className="text-xl mb-3">Repo Analyzer</h2>

      <input
        value={repo}
        onChange={(e) => setRepo(e.target.value)}
        placeholder="Enter repo name"
        className="w-full p-2 rounded bg-white/10 mb-3"
      />

      <button
        onClick={analyzeRepo}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Analyze
      </button>

      {result && (
        <div className="mt-4 bg-white/5 p-3 rounded">
          <p><b>Framework:</b> {result.framework}</p>
          <p><b>Styling:</b> {result.styling}</p>
          <p><b>Architecture:</b> {result.architecture}</p>
          <p><b>Recommendation:</b> {result.recommendation}</p>
        </div>
      )}
    </div>
  )
}