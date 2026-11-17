import { useState, ChangeEvent } from "react";
import { parseQrString } from "../utils/parseQrString";
import { ApiError, createReceipt } from "../form/api";
import { ReceiptFormData, receiptSchema } from "@/schemas/receipt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { applyFieldErrors, getErrorMessage } from "../utils/getErrorMessage";

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
  const router = useRouter();

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
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        router.push("/login");
        return;
      }

      // Пробрасываем ошибки конкретных полей от DRF (например, purchase_date или дубликат fn/fd/fp)
      const hasFieldErrors = applyFieldErrors(error, setError);

      // Если это не ошибка конкретного поля (или есть общая ошибка / 429 / таймаут) — показываем плашку
      if (
        !hasFieldErrors ||
        (error instanceof ApiError && (error.data.non_field_errors || error.data.detail || error.status === 429))
      ) {
        setSubmitStatus({
          success: false,
          message: getErrorMessage(error, "Ошибка валидации данных на сервере."),
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
