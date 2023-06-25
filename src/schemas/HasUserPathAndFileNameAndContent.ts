import { z } from 'zod'
import { isForbiddenName } from '../common/isForbiddenName.js'
import { HasUserPath } from './HasUserPath.js'
import { ApiError } from '../common/ApiError.js'

export const HasUserPathAndFileNameAndContent = HasUserPath.merge(
  z.object({
    fileName: z
      .string({
        invalid_type_error: 'Неверный путь!',
        required_error: 'Не указан путь!',
      })
      .transform(filename => {
        const result = filename + '.txt'
        if (isForbiddenName(result)) {
          throw ApiError.badRequest('Неверное название файла!')
        }
        return result
      }),
    content: z.string().default(''),
  })
)
