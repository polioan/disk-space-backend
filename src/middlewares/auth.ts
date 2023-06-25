import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'

export function auth(req: Request, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') {
    next()
  }

  try {
    const token = req?.headers?.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Пользователь не авторизован' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // @ts-expect-error Assigning user to request in middleware (req.user will be readonly in any other places)
    req.user = decoded
    return next()
  } catch {
    return res.status(401).json({ message: 'Пользователь не авторизован' })
  }
}
