const forbiddenNames = ['thumbs.db']
const forbiddenChars = ['\\', '/', ':', '*', '?', '"', '<', '>', '|']

export function isForbiddenName(name: unknown) {
  if (!name || typeof name !== 'string') {
    return true
  }
  const loweredName = name.toLowerCase()
  for (const char of forbiddenChars) {
    if (loweredName.includes(char)) {
      return true
    }
  }
  return forbiddenNames.includes(loweredName)
}
