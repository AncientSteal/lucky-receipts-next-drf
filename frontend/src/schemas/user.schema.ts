import { z } from "zod";

// ==========================================
// БАЗОВАЯ СХЕМА (Данные пользователя с бэкенда)
// ==========================================

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
});

// Автоматически получаем тип User
export type User = z.infer<typeof userSchema>;

// Схема для формы входа (берём только username и добавляем password)
export const loginSchema = userSchema.pick({ username: true }).extend({
  password: z
    .string()
    .min(6, "Минимум 6 символов")
    .max(128, "Максимум 128 символов")
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Схема для формы регистрации (берём нужные поля + проверка совпадения паролей)
export const registerSchema = userSchema
  .pick({ username: true, email: true, first_name: true, last_name: true })
  .extend({
    password: z
      .string()
      .min(8, "Минимум 8 символов")
      .max(128, "Максимум 128 символов")
      .regex(/[0-9]/, "Добавьте хотя бы одну цифру"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
