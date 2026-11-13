import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema, User } from "@/schemas/user.schema";
import { ApiError, registerUser } from "../login/api";

export function useRegisterForm(onSuccess?: (user: User) => void) {
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");

    try {
      const user = await registerUser(data);
      if (onSuccess) onSuccess(user);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        const result = error.data;
        // Пробрасываем ошибки конкретных полей от DRF в форму
        (Object.keys(result) as Array<keyof RegisterFormData>).forEach((field) => {
          const messages = result[field];
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field, { type: "server", message: messages[0] });
          }
        });

        if (result.non_field_errors?.[0] || result.detail) {
          setServerError(result.non_field_errors?.[0] || result.detail || "");
        }
        return;
      }

      const isTimeout = error instanceof Error && error.name === "TimeoutError";
      setServerError(
        isTimeout
          ? "Сервер отвечает слишком долго. Попробуйте позже."
          : "Сетевая ошибка сервера. Попробуйте позже."
      );
    }
  };

  return {
    register,
    errors,
    isSubmitting,
    serverError,
    onSubmit: handleSubmit(onSubmit),
  };
}