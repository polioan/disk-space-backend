import { ApiError } from '../common/ApiError.js'
import { isForbiddenName } from '../common/isForbiddenName.js'
import { z } from 'zod'
import { HasUserPath } from './HasUserPath.js'

export const HasUserPathAndNewPath = HasUserPath.merge(
  z.object({
    newPath: z
      .string({
        invalid_type_error: 'Неверный путь!',
        required_error: 'Не указан путь!',
      })
      .transform(path => {
        if (isForbiddenName(path)) {
          throw ApiError.badRequest('Неверный путь!')
        }
        return path
      }),
  })
)
