import express from 'express'
import { auth } from '../middlewares/auth.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { HasUserPath } from '../schemas/HasUserPath.js'
import { isForbiddenName } from '../common/isForbiddenName.js'
import path from 'node:path'
import fs from 'node:fs/promises'
import { isFile } from '../common/isFile.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
  try {
    const { userPath } = HasUserPath.parse(req.query)
    const destinationPath = resolveFromUserDataPath(req.user.id, ...userPath)
    const fileNames = (await fs.readdir(destinationPath)).filter(
      file => !isForbiddenName(file)
    )
    const files = []
    for (const fileName of fileNames) {
      files.push({
        name: fileName,
        isFile: await isFile(path.join(destinationPath, fileName)),
      })
    }
    res.status(200).json({ files, count: files.length })
  } catch (e) {
    return next(e)
  }
})

export default router
