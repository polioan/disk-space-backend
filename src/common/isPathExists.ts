import fs from 'node:fs/promises'

export async function isPathExists(path: string) {
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}
