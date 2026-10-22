export interface ReceiptFormData {
  fn: string;
  fd: string;
  fp: string;
  purchase_date: string;
  amount: string;
}

// Partial означает, что все свойства могут отсутствовать, если ошибки по этому полю нет
// Record говорит, что ключами могут быть только поля из формы, а значениями — строки с текстом ошибки
export type ReceiptFormErrors = Partial<Record<keyof ReceiptFormData, string>>;

/**
 * Валидирует данные формы добавления чека.
 * 
 * formData — текущие данные из полей ввода формы
 * return объект с текстами ошибок для каждого невалидного поля
 */
export const validateReceiptForm = (formData: ReceiptFormData): ReceiptFormErrors => {
  const newErrors: ReceiptFormErrors = {};
  const digitsOnly = /^\d+$/;

  // Валидация ФН
  if (!formData.fn) {
    newErrors.fn = "Поле ФН обязательно для заполнения";
  } else if (!digitsOnly.test(formData.fn)) {
    newErrors.fn = "ФН должен состоять только из цифр";
  }

  // Валидация ФД
  if (!formData.fd) {
    newErrors.fd = "Поле ФД обязательно для заполнения";
  } else if (!digitsOnly.test(formData.fd)) {
    newErrors.fd = "ФД должен состоять только из цифр";
  }

  // Валидация ФП
  if (!formData.fp) {
    newErrors.fp = "Поле ФП обязательно для заполнения";
  } else if (!digitsOnly.test(formData.fp)) {
    newErrors.fp = "ФП должен состоять только из цифр";
  }

  // Валидация даты покупки
  if (!formData.purchase_date) {
    newErrors.purchase_date = "Укажите дату и время покупки";
  } else {
    const selectedDate = new Date(formData.purchase_date);
    const now = new Date();
    if (selectedDate > now) {
      newErrors.purchase_date = "Дата покупки не может быть в будущем";
    }
  }

  // Валидация суммы чека
  if (!formData.amount) {
    newErrors.amount = "Укажите сумму чека";
  } else {
    // Заменяем запятую на точку, если пользователь ввёл её по привычке
    const normalizedAmount = formData.amount.replace(",", ".");
    const numAmount = parseFloat(normalizedAmount);
    
    if (isNaN(numAmount) || numAmount < 1000) {
      newErrors.amount = "Сумма в чеке должна быть не менее 1000 ₽";
    }
  }

  return newErrors;
};