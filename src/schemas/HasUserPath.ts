import { z } from 'zod'

export const HasUserPath = z.object({
  userPath: z
    .array(
      z.string({
        invalid_type_error: 'Неверный путь!',
        required_error: 'Не указан путь!',
      }),
      {
        invalid_type_error: 'Неверный путь!',
        required_error: 'Не указан путь!',
      }
    )
    .default([]),
})
