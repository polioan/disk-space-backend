import { z } from 'zod'
import { HasUserPath } from './HasUserPath.js'

export const HasUserPathAndFileName = HasUserPath.merge(
  z.object({
    fileName: z.string({
      invalid_type_error: 'Неверный путь!',
      required_error: 'Не указан путь!',
    }),
  })
)
