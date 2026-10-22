import { useState, ChangeEvent, FormEvent } from "react";
import { CloseIcon, DangerIcon } from "./Icons";
import { getCookieClient } from "@/app/utils/getCookieClient";
import { validateReceiptForm, ReceiptFormData, ReceiptFormErrors } from "@/app/utils/validateReceipt";
import { parseQrString } from "@/app/utils/parseQrString";
import { getApiUrl } from "@/app/utils/getApi";
import "./ReceiptForm.css";

interface ReceiptFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface SubmitStatus {
  success: boolean | null;
  message: string;
}

export default function ReceiptForm({ onSuccess, onClose }: ReceiptFormProps) {
  const [formData, setFormData] = useState<ReceiptFormData>({
    fn: "",
    fd: "",
    fp: "",
    purchase_date: "",
    amount: "",
  });

  // Стейт для поля быстрой вставки строки QR-кода
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

    // запускаем  утилиту парсинга
    const parsedData = parseQrString(value);

    if (parsedData) {
      setFormData(parsedData); // наполняем инпуты
      setErrors({}); // чистим ошибки
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitStatus({ success: null, message: "" });

    const validationErrors = validateReceiptForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);

    const controller = new AbortController();
    const timeoutSignal = AbortSignal.timeout(5000);
    const combinedSignal = AbortSignal.any([controller.signal, timeoutSignal]);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/receipts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookieClient("csrftoken") ?? undefined,
        } as Record<string, string>,
        signal: combinedSignal,
        body: JSON.stringify({
          fn: formData.fn,
          fd: formData.fd,
          fp: formData.fp,
          purchase_date: formData.purchase_date ? new Date(formData.purchase_date).toISOString() : "", // сразу к ISO для бэкенда
          amount: formData.amount,
        }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Чек успешно зарегистрирован и отправлен на модерацию!",
        });
        if (onSuccess) onSuccess();
      } else {
        if (result.purchase_date) {
          setErrors((prev) => ({
            ...prev,
            purchase_date: result.purchase_date,
          }));
        }
        if (result.non_field_errors) {
          setSubmitStatus({ success: false, message: result.non_field_errors });
        } else {
          setSubmitStatus({
            success: false,
            message: "Ошибка валидации данных на сервере.",
          });
        }
      }
    } catch (error: unknown) {
      const isTimeout = error instanceof Error && error.name === "TimeoutError";

      if (isTimeout || (combinedSignal.aborted && combinedSignal.reason?.name === "TimeoutError")) {
        console.error("Превышено время ожидания ответа от сервера!");
        setSubmitStatus({
          success: false,
          message: "Сервер отвечает слишком долго. Проверьте соединение и попробуйте позже.",
        });
      } else if (error instanceof Error && error.name === "AbortError") {
        console.log("Запрос отменен");
      } else {
        console.error("Сетевая ошибка при загрузке формы:", error);
        setSubmitStatus({
          success: false,
          message: "Сетевая ошибка сервера. Попробуйте позже.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="screen-form">
      <div className="form-container">
        <div className="form-header">
          <h3>Регистрация чека</h3>
          <p>Введите необходимые данные с чека</p>
        </div>
        <button
          type="button"
          className="close-form-btn"
          onClick={() => onClose?.()}
          aria-label="Закрыть форму"
        >
          <CloseIcon />
        </button>
        <div className="qr-autofill-group">
          <label>Автозаполнение по строке QR-кода:</label>
          <input
            type="text"
            value={qrRawString}
            onChange={handleQrChange}
            placeholder="Вставьте строку (пример: t=datetime&s=1500&fn=...)"
          />
        </div>
        <form onSubmit={handleSubmit} noValidate>
          {submitStatus.message && (
            <div
              className={`form-alert ${submitStatus.success ? "alert-success" : "alert-error"}`}
            >
              {submitStatus.success === false && <DangerIcon />}
              {submitStatus.message}
            </div>
          )}

          <div className="form-group">
            <label>ФН</label>
            <input
              type="text"
              name="fn"
              value={formData.fn}
              onChange={handleChange}
              className={errors.fn ? "input-error" : ""}
              placeholder="Введите ФН"
            />
            {errors.fn && (
              <span className="error-text">
                <DangerIcon />
                {errors.fn}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Номер чека</label>
            <input
              type="text"
              name="fd"
              value={formData.fd}
              onChange={handleChange}
              className={errors.fd ? "input-error" : ""}
              placeholder="Введите номер чека (ФД)"
            />
            {errors.fd && (
              <span className="error-text">
                <DangerIcon />
                {errors.fd}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>ФП</label>
            <input
              type="text"
              name="fp"
              value={formData.fp}
              onChange={handleChange}
              className={errors.fp ? "input-error" : ""}
              placeholder="Введите ФП"
            />
            {errors.fp && (
              <span className="error-text">
                <DangerIcon />
                {errors.fp}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Дата покупки</label>
            <input
              type="datetime-local"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
              className={errors.purchase_date ? "input-error" : ""}
            />
            {errors.purchase_date && (
              <span className="error-text">
                <DangerIcon />
                {errors.purchase_date}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Сумма</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? "input-error" : ""}
              placeholder="Минимум 1000"
            />
            {errors.amount && (
              <span className="error-text">
                <DangerIcon />
                {errors.amount}
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Отправка..." : "Загрузить"}
          </button>
        </form>
      </div>
    </section>
  );
}
