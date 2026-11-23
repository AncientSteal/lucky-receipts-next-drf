import { useState, ChangeEvent } from "react";
import { parseQrString } from "../utils/parseQrString";
import { createReceipt } from "../form/api";
import { ReceiptFormData, receiptSchema } from "@/schemas/receipt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { applyFieldErrors, getErrorMessage } from "../utils/getErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError, BaseValidationErrors } from "../utils/apiError";

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
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema),
    mode: "onChange",
    defaultValues: { fn: "", fd: "", fp: "", purchase_date: "", amount: "" },
  });

  // Описываем мутацию создания чека
  const createReceiptMutation = useMutation({
    mutationFn: (data: ReceiptFormData) => createReceipt(data),
    onSuccess: async () => {
      // Помечаем все страницы в словаре чеков как устаревшие
      await queryClient.invalidateQueries({ queryKey: ["receipts"] });

      setSubmitStatus({
        success: true,
        message: "Чек успешно зарегистрирован и отправлен на модерацию!",
      });
      reset(); // Очищаем форму
      setQrRawString("");

      if (onSuccess) onSuccess();
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        queryClient.setQueryData(["user"], null);
        router.push("/login");
        return;
      }

      // Пробрасываем ошибки конкретных полей от DRF в инпуты
      const hasFieldErrors = applyFieldErrors(error, setError);

      // Если это не ошибка конкретного поля (или общие ошибки) — показываем плашку с текстом
      if (
        !hasFieldErrors ||
        (error instanceof ApiError && (error.data.non_field_errors || error.data.detail || error.status === 429))
      ) {
        setSubmitStatus({
          success: false,
          message: getErrorMessage(error, "Ошибка валидации данных на сервере."),
        });
      }
    },
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
    createReceiptMutation.mutate(data);
  }

  return {
    register,
    qrRawString,
    errors,
    isSubmitting: createReceiptMutation.isPending,
    submitStatus,
    handleQrChange,
    onSubmit: handleSubmit(onSubmit),
  };
}
