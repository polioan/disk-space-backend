import express from 'express'
import { auth } from '../middlewares/auth.js'
import path from 'node:path'
import { HasStringUserPath } from '../schemas/HasStringUserPath.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { ApiError } from '../common/ApiError.js'
import { isForbiddenName } from '../common/isForbiddenName.js'
import fs from 'node:fs/promises'
import { isPathExists } from '../common/isPathExists.js'
import { getFolderSize } from '../common/getFolderSize.js'
import type fileUpload from 'express-fileupload'

const router = express.Router()

router.post('/', auth, async (req, res, next) => {
  try {
    const files = (
      req.files
        ? Array.isArray(req.files.files)
          ? req.files.files
          : [req.files.files]
        : []
    ).filter(v => v !== undefined) as fileUpload.UploadedFile[]

    if (files.length === 0 || !req?.files?.files) {
      return next(ApiError.badRequest('Нужен хотя бы 1 файл!'))
    }

    const { userPath } = HasStringUserPath.parse(req.body)
    const destinationPath = resolveFromUserDataPath(req.user.id, ...userPath)
    const isDestinationPathExists = await isPathExists(destinationPath)
    if (!isDestinationPathExists) {
      return next(ApiError.badRequest('Путь не существует!'))
    }

    let spaceToAdd = 0
    for (const file of files) {
      const filePath = path.join(destinationPath, file.name)
      if (isForbiddenName(file.name) || !filePath.startsWith(destinationPath)) {
        return next(ApiError.forbidden('Путь не существует!'))
      }
      try {
        const stat = await fs.stat(filePath)
        spaceToAdd -= stat.size
      } catch {}
      spaceToAdd += file.size
    }

    const userFolderSize = await getFolderSize(
      resolveFromUserDataPath(req.user.id)
    )

    const newSize = userFolderSize + spaceToAdd

    if (newSize > +process.env.STORAGE_SIZE) {
      return next(ApiError.badRequest('Не хватает места!'))
    }

    for (const file of files) {
      const filePath = path.join(destinationPath, file.name)
      await file.mv(filePath)
    }

    res.status(201).json({ usedSpace: newSize })
  } catch (e) {
    return next(e)
  }
})

export default router
