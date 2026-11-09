import { useState, ChangeEvent } from "react";
import { parseQrString } from "../utils/parseQrString";
import { ApiError, createReceipt } from "../form/api";
import { ReceiptFormData, receiptSchema } from "@/schemas/receipt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface SubmitStatus {
  success: boolean | null;
  message: string;
}

export function useReceiptForm(onSuccess?: () => void) {
  const [qrRawString, setQrRawString] = useState<string>("");
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    success: null,
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    mode: "onChange",
    defaultValues: { fn: "", fd: "", fp: "", purchase_date: "", amount: "" },
  });

  const handleQrChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQrRawString(value);

    const parsedData = parseQrString(value);
    if (parsedData) {
      Object.entries(parsedData).forEach(([key, val]) => {
        setValue(key as keyof ReceiptFormData, val as string);
      });
      clearErrors();
    }
  };

  const onSubmit = async (data: ReceiptFormData) => {
    setSubmitStatus({ success: null, message: "" });

    try {
      await createReceipt(data);
      setSubmitStatus({
        success: true,
        message: "Чек успешно зарегистрирован и отправлен на модерацию!",
      });
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      // Обработка ошибки сервера
      if (error instanceof ApiError) {
        const result = error.data;
        if (result.purchase_date) {
          setError("purchase_date", {
            type: "server",
            message: result.purchase_date,
          });
        }
        setSubmitStatus({
          success: false,
          message:
            result.non_field_errors || "Ошибка валидации данных на сервере.",
        });
        return;
      }
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
    }
  };

  return {
    register,
    qrRawString,
    errors,
    isSubmitting,
    submitStatus,
    handleQrChange,
    onSubmit: handleSubmit(onSubmit),
  };
}
