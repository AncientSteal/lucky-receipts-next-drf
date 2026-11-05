import { useState, ChangeEvent, FormEvent } from "react";
import {
  ReceiptFormData,
  ReceiptFormErrors,
  validateReceiptForm,
} from "../utils/validateReceipt";
import { parseQrString } from "../utils/parseQrString";
import { ApiError, createReceipt } from "../form/api";

interface SubmitStatus {
  success: boolean | null;
  message: string;
}

export function useReceiptForm(onSuccess?: () => void) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    fn: "",
    fd: "",
    fp: "",
    purchase_date: "",
    amount: "",
  });
  const [qrRawString, setQrRawString] = useState<string>("");
  const [errors, setErrors] = useState<ReceiptFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    success: null,
    message: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ReceiptFormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleQrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrRawString(value);

    const parsedData = parseQrString(value);
    if (parsedData) {
      setFormData(parsedData);
      setErrors({});
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ success: null, message: "" });

    const validationErrors = validateReceiptForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    try {
      await createReceipt(formData);

      setSubmitStatus({
        success: true,
        message: "Чек успешно зарегистрирован и отправлен на модерацию!",
      });

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      // Обработка системных ошибок (сеть, таймаут)
      const isTimeout = error instanceof Error && error.name === "TimeoutError";
      if (isTimeout) {
        setSubmitStatus({
          success: false,
          message:
            "Сервер отвечает слишком долго. Проверьте соединение и попробуйте позже.",
        });
      } else {
        setSubmitStatus({
          success: false,
          message: "Сетевая ошибка сервера. Попробуйте позже.",
        });
      }

      // Обработка ошибки сервера
      if (error instanceof ApiError) {
        const result = error.data;
        if (result.purchase_date) {
          setErrors((prev) => ({
            ...prev,
            purchase_date: result.purchase_date,
          }));
        }
        setSubmitStatus({
          success: false,
          message: result.non_field_errors || "Ошибка валидации данных на сервере." });
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    qrRawString,
    errors,
    isSubmitting,
    submitStatus,
    handleChange,
    handleQrChange,
    handleSubmit,
  };
}
