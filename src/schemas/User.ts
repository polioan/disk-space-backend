import { z } from 'zod'

export const User = z.object({
  email: z
    .string({
      invalid_type_error: 'Email не является строкой!',
      required_error: 'Email не указан!',
    })
    .email({ message: 'Неверный email!' }),
  password: z
    .string({
      invalid_type_error: 'Пароль не является строкой!',
      required_error: 'Пароль не указан!',
    })
    .min(7, { message: 'В пароле должно быть хотя бы 7 символов!' })
    .max(23, {
      message: 'Пароль не может быть больше 23 символов!',
    }),
})
