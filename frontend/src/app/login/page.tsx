"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/schemas/user.schema";
import styles from "./page.module.css";
import { useLoginForm } from "../hooks/useLoginFrom";
import { useRegisterForm } from "../hooks/useRegisterFrom";
import { DangerIcon } from "@/components/Icons";
import { useQueryClient } from "@tanstack/react-query";
import { useReceiptsStore } from "../store/useReceiptsStore";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleAuthSuccess = (user?: User) => {
    // Сносим из памяти любые чеки предыдущей сессии
    queryClient.removeQueries({ queryKey: ["receipts"] });
    // Сбрасываем пагинацию на 1-ю страницу
    useReceiptsStore.getState().setPage(1);
    if (user) {
      queryClient.setQueryData(["user"], user);
    } else {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    }
    router.push("/cabinet");
  };

  const loginForm = useLoginForm(handleAuthSuccess);
  const registerForm = useRegisterForm(handleAuthSuccess);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Link href="/" className={styles.backLink}>
          ← На главную
        </Link>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
            onClick={() => setMode("login")}
          >
            Вход
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
            onClick={() => setMode("register")}
          >
            Регистрация
          </button>
        </div>

        {mode === "login" ? (
          <>
            <h1 className={styles.title}>Вход в личный кабинет</h1>
            <form onSubmit={loginForm.onSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Логин</label>
                <input
                  type="text"
                  {...loginForm.register("username")}
                  className={`${styles.input} ${loginForm.errors.username ? styles.inputError : ""}`}
                  placeholder="Введите имя пользователя"
                />
                {loginForm.errors.username && (
                  <span className={styles.errorText}>
                    <DangerIcon />
                    {loginForm.errors.username.message}
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Пароль</label>
                <input
                  type="password"
                  {...loginForm.register("password")}
                  className={`${styles.input} ${loginForm.errors.password ? styles.inputError : ""}`}
                  placeholder="••••••••"
                />
                {loginForm.errors.password && (
                  <span className={styles.errorText}>
                    <DangerIcon />
                    {loginForm.errors.password.message}
                  </span>
                )}
              </div>

              {loginForm.submitStatus.success === false && (
                <div className={styles.alertError}>
                  {loginForm.submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                disabled={loginForm.isSubmitting}
                className={styles.submitBtn}
              >
                {loginForm.isSubmitting ? "Входим..." : "Войти"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Создать аккаунт</h1>
            <form onSubmit={registerForm.onSubmit} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Логин *</label>
                <input
                  type="text"
                  {...registerForm.register("username")}
                  className={`${styles.input} ${registerForm.errors.username ? styles.inputError : ""}`}
                  placeholder="Придумайте логин"
                />
                {registerForm.errors.username && (
                  <p className={styles.errorText}>
                    {registerForm.errors.username.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  {...registerForm.register("email")}
                  className={`${styles.input} ${registerForm.errors.email ? styles.inputError : ""}`}
                  placeholder="name@example.com"
                />
                {registerForm.errors.email && (
                  <p className={styles.errorText}>
                    {registerForm.errors.email.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Имя</label>
                <input
                  type="text"
                  {...registerForm.register("first_name")}
                  className={styles.input}
                  placeholder="Иван"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Фамилия</label>
                <input
                  type="text"
                  {...registerForm.register("last_name")}
                  className={styles.input}
                  placeholder="Иванов"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Пароль *</label>
                <input
                  type="password"
                  {...registerForm.register("password")}
                  className={`${styles.input} ${registerForm.errors.password ? styles.inputError : ""}`}
                  placeholder="Минимум 8 символов"
                />
                {registerForm.errors.password && (
                  <p className={styles.errorText}>
                    {registerForm.errors.password.message}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Повторите пароль *</label>
                <input
                  type="password"
                  {...registerForm.register("passwordConfirm")}
                  className={`${styles.input} ${registerForm.errors.passwordConfirm ? styles.inputError : ""}`}
                  placeholder="Повторите пароль"
                />
                {registerForm.errors.passwordConfirm && (
                  <p className={styles.errorText}>
                    {registerForm.errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              {registerForm.serverError && (
                <div className={styles.alertError}>
                  {registerForm.serverError}
                </div>
              )}

              <button
                type="submit"
                disabled={registerForm.isSubmitting}
                className={styles.submitBtn}
              >
                {registerForm.isSubmitting
                  ? "Регистрируем..."
                  : "Зарегистрироваться"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
