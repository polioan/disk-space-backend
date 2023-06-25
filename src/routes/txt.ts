import express from 'express'
import { auth } from '../middlewares/auth.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import fs from 'node:fs/promises'
import { HasUserPathAndFileNameAndContent } from '../schemas/HasUserPathAndFileNameAndContent.js'
import { getFolderSize } from '../common/getFolderSize.js'
import { ApiError } from '../common/ApiError.js'

const router = express.Router()

router.post('/', auth, async (req, res, next) => {
  try {
    const { userPath, fileName, content } =
      HasUserPathAndFileNameAndContent.parse(req.body)
    const writePath = resolveFromUserDataPath(
      req.user.id,
      ...userPath,
      fileName
    )
    await fs.writeFile(writePath, content, 'utf8')
    const usedSpace = await getFolderSize(resolveFromUserDataPath(req.user.id))
    if (usedSpace > +process.env.STORAGE_SIZE) {
      await fs.unlink(writePath)
      return next(ApiError.badRequest('Не хватает места!'))
    }
    res.status(201).json({ usedSpace })
  } catch (e) {
    return next(e)
  }
})

export default router
