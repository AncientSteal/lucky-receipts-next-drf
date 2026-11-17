import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema, User } from "@/schemas/user.schema";
import { ApiError, registerUser } from "../login/api";
import { applyFieldErrors, getErrorMessage } from "../utils/getErrorMessage";

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
      const hasFieldErrors = applyFieldErrors(error, setError);

      if (!hasFieldErrors || (error instanceof ApiError && (error.data.non_field_errors || error.data.detail || error.status === 429))) {
        setServerError(getErrorMessage(error, "Проверьте правильность заполнения полей."));
      }
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