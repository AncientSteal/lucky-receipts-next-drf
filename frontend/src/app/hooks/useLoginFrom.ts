import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema, User } from "@/schemas/user.schema";
import { loginUser } from "../login/api";
import { getErrorMessage } from "../utils/getErrorMessage";

interface SubmitStatus {
  success: boolean | null;
  message: string;
}

export function useLoginForm(onSuccess?: (user?: User) => void) {
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
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setSubmitStatus({ success: null, message: "" });

    try {
      const user = await loginUser(data);
      await loginUser(data);
      setSubmitStatus({
        success: true,
        message: "Вход выполнен успешно!",
      });
      if (onSuccess) onSuccess(user);
    } catch (error: unknown) {
      setSubmitStatus({
        success: false,
        message: getErrorMessage( error, "Неверное имя пользователя или пароль.",
        ),
      });
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
