import express from 'express'
import { auth } from '../middlewares/auth.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { HasUserPathAndFileName } from '../schemas/HasUserPathAndFileName.js'
import fs from 'node:fs/promises'
import { isPathExists } from '../common/isPathExists.js'
import { ApiError } from '../common/ApiError.js'
import { getFolderSize } from '../common/getFolderSize.js'

const router = express.Router()

router.delete('/', auth, async (req, res, next) => {
  try {
    const { userPath, fileName } = HasUserPathAndFileName.parse(req.query)
    const destinationPath = resolveFromUserDataPath(
      req.user.id,
      ...userPath,
      fileName
    )
    if (!(await isPathExists(destinationPath))) {
      return next(ApiError.notFound('Файл не найден!'))
    }
    await fs.rm(destinationPath, { recursive: true, force: true })
    const usedSpace = await getFolderSize(resolveFromUserDataPath(req.user.id))
    res.status(200).json({ usedSpace })
  } catch (e) {
    return next(e)
  }
})

export default router
