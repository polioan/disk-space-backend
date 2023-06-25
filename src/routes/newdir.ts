import express from 'express'
import { auth } from '../middlewares/auth.js'
import { HasUserPathAndNewPath } from '../schemas/HasUserPathAndNewPath.js'
import fs from 'node:fs/promises'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { ApiError } from '../common/ApiError.js'

const router = express.Router()

router.post('/', auth, async (req, res, next) => {
  try {
    const { userPath, newPath } = HasUserPathAndNewPath.parse(req.body)
    const pathToCreate = resolveFromUserDataPath(
      req.user.id,
      ...userPath,
      newPath
    )
    try {
      await fs.mkdir(pathToCreate)
    } catch {
      return next(ApiError.badRequest('Папка уже существует!'))
    }
    res.sendStatus(201)
  } catch (e) {
    return next(e)
  }
})

export default router
