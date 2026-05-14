import express from 'express'

const router = express.Router()

router.post('/analyze', async (req, res) => {
  try {
    const { repoName } = req.body

    const summary = {
      framework: 'React',
      styling: 'TailwindCSS',
      architecture: 'Component-based frontend',
      recommendation:
        'Use feature-based folder structure',
    }

    res.json(summary)
  } catch (error) {
    res.status(500).json({
      error: 'Analysis failed',
    })
  }
})

export default router