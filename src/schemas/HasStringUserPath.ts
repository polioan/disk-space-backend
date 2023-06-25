import { ApiError } from '../common/ApiError.js'
import { z } from 'zod'

const StringArray = z.array(
  z.string({
    invalid_type_error: 'Неверный путь!',
    required_error: 'Не указан путь!',
  }),
  {
    invalid_type_error: 'Неверный путь!',
    required_error: 'Не указан путь!',
  }
)

export const HasStringUserPath = z.object({
  userPath: z
    .string({
      invalid_type_error: 'Неверный путь!',
      required_error: 'Не указан путь!',
    })
    .transform(pathStr => {
      let arr
      try {
        arr = JSON.parse(pathStr)
      } catch {
        throw ApiError.badRequest('Неверный путь!')
      }
      return StringArray.parse(arr)
    }),
})
