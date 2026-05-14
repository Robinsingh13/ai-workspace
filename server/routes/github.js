import express from 'express'
import { exec } from 'child_process'

const router = express.Router()

router.post('/clone', async (req, res) => {
  try {
    const { repoUrl } = req.body

    const repoName = repoUrl.split('/').pop().replace('.git', '')

    exec(`git clone ${repoUrl} ./repos/${repoName}`, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Clone failed' })
      }

      res.json({
        message: 'Repo cloned successfully',
        repoName,
      })
    })
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router