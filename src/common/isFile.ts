import fs from 'node:fs/promises'

export async function isFile(path: string) {
  try {
    const stat = await fs.lstat(path)
    return stat.isFile()
  } catch {
    return false
  }
}
