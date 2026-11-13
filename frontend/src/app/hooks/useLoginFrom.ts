import { useState } from "react";
import { ApiError } from "../login/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/schemas/user.schema";
import { loginUser } from "../login/api";

interface SubmitStatus {
  success: boolean | null;
  message: string;
}

export function useLoginForm(onSuccess?: () => void) {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    success: null,
    message: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitStatus({ success: null, message: "" });

    try {
      await loginUser(data);
      setSubmitStatus({
        success: true,
        message: "Вход выполнен успешно!",
      });
      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      // Обработка ошибки сервера
      if (error instanceof ApiError) {
        const result = error.data;
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
    errors,
    isSubmitting,
    submitStatus,
    onSubmit: handleSubmit(onSubmit),
  };
}