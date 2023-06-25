import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../schemas/User.js'
import { resolveFromUserDataPath } from '../common/resolveFromUserDataPath.js'
import { mkdir } from 'node:fs/promises'
import { createJWT } from '../common/createJWT.js'
import { ApiError } from '../common/ApiError.js'
import { prisma } from '../common/prisma.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = User.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      return next(
        ApiError.badRequest('Пользователь с таким именем уже существует!')
      )
    }
    const hashedPassword = await bcrypt.hash(password, 7)
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword },
    })
    await mkdir(resolveFromUserDataPath(newUser.id))
    res.status(201).json({ token: createJWT(newUser.id) })
  } catch (e) {
    return next(e)
  }
})

export default router
