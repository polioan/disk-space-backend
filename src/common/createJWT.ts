import jwt from 'jsonwebtoken'
import type { Request } from 'express'
import type { User } from '../common/prisma.js'

export function createJWT(id: User['id']) {
  const payload: Request['user'] = { id }
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
}
