import { ApiError } from '../common/ApiError.js'
import { ZodError } from 'zod'
import type { NextFunction, Request, Response } from 'express'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ message: err?.issues[0]?.message ?? 'Неверный ввод!' })
  }
  if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
    return res.status(404).json({ message: 'Папка или файл не найдены!' })
  }
  console.error(err)
  return res.status(500).json({ message: 'Неизвестная ошибка!' })
}
