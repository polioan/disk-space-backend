import { promisify } from 'node:util'
import fastFolderSizeInternal from 'fast-folder-size'

const fastFolderSize = promisify(fastFolderSizeInternal)

export async function getFolderSize(path: string) {
  const size = await fastFolderSize(path)
  return size || 0
}
