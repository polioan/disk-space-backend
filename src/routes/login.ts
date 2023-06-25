import express from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../schemas/User.js'
import { createJWT } from '../common/createJWT.js'
import { ApiError } from '../common/ApiError.js'
import { prisma } from '../common/prisma.js'

const router = express.Router()

router.post('/', async (req, res, next) => {
  try {
    const { email, password } = User.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return next(ApiError.badRequest('Неверный пользователь или пароль!'))
    }
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return next(ApiError.badRequest('Неверный пользователь или пароль!'))
    }
    return res.status(200).json({ token: createJWT(user.id) })
  } catch (e) {
    return next(e)
  }
})

export default router
