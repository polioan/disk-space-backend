import path from 'node:path'
import { ApiError } from './ApiError.js'
import { isForbiddenName } from './isForbiddenName.js'
import type { User } from '../common/prisma.js'

export function resolveFromUserDataPath(
  userId: User['id'],
  ...paths: string[]
) {
  for (const pathToTest of paths) {
    if (isForbiddenName(pathToTest)) {
      throw ApiError.badRequest('Неверный путь!')
    }
  }
  const basePath = path.resolve(process.env.USER_DATA_PATHNAME, userId)
  const dataPath = path.join(basePath, ...paths)
  if (!dataPath.startsWith(basePath)) {
    throw ApiError.forbidden('Неверный путь!')
  }
  return dataPath
}
