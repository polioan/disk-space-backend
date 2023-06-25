import express from 'express'
import { auth } from '../middlewares/auth.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { getFolderSize } from '../common/getFolderSize.js'
import { ApiError } from '../common/ApiError.js'
import { prisma } from '../common/prisma.js'

const router = express.Router()

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    })

    if (!user) {
      return next(ApiError.notFound('Данные пользователя не найдены!'))
    }

    const usedSpace = await getFolderSize(resolveFromUserDataPath(req.user.id))

    const info = {
      email: user.email,
      usedSpace,
      storageSize: +process.env.STORAGE_SIZE,
    }
    res.status(200).json(info)
  } catch (e) {
    return next(e)
  }
})

export default router
