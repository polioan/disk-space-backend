import express from 'express'
import { auth } from '../middlewares/auth.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { HasUserPathAndFileName } from '../schemas/HasUserPathAndFileName.js'
import { isFile } from '../common/isFile.js'
import { ApiError } from '../common/ApiError.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
  try {
    const { userPath, fileName } = HasUserPathAndFileName.parse(req.query)
    const destinationPath = resolveFromUserDataPath(
      req.user.id,
      ...userPath,
      fileName
    )
    if (!(await isFile(destinationPath))) {
      return next(ApiError.badRequest('Неверный путь!'))
    }
    res.sendFile(destinationPath)
  } catch (e) {
    return next(e)
  }
})

export default router
