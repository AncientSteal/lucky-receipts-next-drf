// receipt.schema.ts
import { z } from "zod";

const digitsOnly = /^\d+$/;

// ==========================================
// БАЗОВАЯ СХЕМА (Чистые данные от API)
// ==========================================
export const apiReceiptSchema = z.object({
  id: z.coerce.number(),
  fn: z.string(),
  fd: z.string(),
  fp: z.string(),
  purchase_date: z.string(),
  amount: z.coerce.number(), // Число, как присылает бэкенд
});

// Схема статусов чека
export const receiptStatusSchema = z.enum(["accepted", "checking", "rejected"]);
export type ReceiptStatus = z.infer<typeof receiptStatusSchema>;

export const extendedReceiptSchema = apiReceiptSchema.extend({
  status: receiptStatusSchema,
  status_display: z.string(),
  registration_date: z.string(),
  reject_reason: z.string().nullable().optional(),
});

// Схема для пагинации (которую вызовет Zustand)
export const paginatedReceiptsSchema = z.object({
  count: z.number(),
  results: z.array(extendedReceiptSchema),
});

// Типы для бэкенд-данных
export type Receipt = z.infer<typeof apiReceiptSchema>;
export type ExtendedReceipt = z.infer<typeof extendedReceiptSchema>;

// ==========================================
// UI СХЕМА (Для формы создания чека)
// ==========================================
// Мы берем поля из apiReceiptSchema, но переопределяем их под требования формы
export const receiptSchema = apiReceiptSchema.omit({id: true}).extend({
  fn: z
    .string()
    .min(1, "Поле ФН обязательно для заполнения")
    .regex(digitsOnly, "ФН должен состоять только из цифр"),
    
  fd: z
    .string()
    .min(1, "Поле ФД обязательно для заполнения")
    .regex(digitsOnly, "ФД должен состоять только из цифр"),
    
  fp: z
    .string()
    .min(1, "Поле ФП обязательно для заполнения")
    .regex(digitsOnly, "ФП должен состоять только из цифр"),
    
  purchase_date: z
    .string()
    .min(1, "Укажите дату и время покупки")
    .refine((val) => {
      const selectedDate = new Date(val);
      const now = new Date();
      return selectedDate <= now;
    }, "Дата покупки не может быть в будущем"),
    
  amount: z
    .string()
    .min(1, "Укажите сумму чека")
    .transform((val) => val.replace(",", ".")) 
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 1000;
    }, "Сумма в чеке должна быть не менее 1000 ₽"),
});

// Автоматически извлекаем TypeScript тип из схемы Zod
export type ReceiptFormData = z.infer<typeof receiptSchema>;