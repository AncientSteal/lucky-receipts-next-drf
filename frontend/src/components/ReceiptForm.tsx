// components/ReceiptForm.tsx
"use client";

import { useReceiptForm } from "@/app/hooks/useReceiptForm";
import { CloseIcon, DangerIcon } from "./Icons";

interface ReceiptFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function ReceiptForm({ onSuccess, onClose }: ReceiptFormProps) {
  const {
    register,
    qrRawString,
    errors,
    isSubmitting,
    submitStatus,
    handleQrChange,
    onSubmit,
  } = useReceiptForm(onSuccess);

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
        <form onSubmit={onSubmit} noValidate>
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
              className={errors.fn ? "input-error" : ""}
              placeholder="Введите ФН"
              {...register('fn')}
            />
            {errors.fn && (
              <span className="error-text">
                <DangerIcon />
                {errors.fn.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Номер чека</label>
            <input
              type="text"
              className={errors.fd ? "input-error" : ""}
              placeholder="Введите номер чека (ФД)"
              {...register('fd')}
            />
            {errors.fd && (
              <span className="error-text">
                <DangerIcon />
                {errors.fd.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>ФП</label>
            <input
              type="text"
              className={errors.fp ? "input-error" : ""}
              placeholder="Введите ФП"
              {...register('fp')}
            />
            {errors.fp && (
              <span className="error-text">
                <DangerIcon />
                {errors.fp.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Дата покупки</label>
            <input
              type="datetime-local"
              className={errors.purchase_date ? "input-error" : ""}
              {...register('purchase_date')}
            />
            {errors.purchase_date && (
              <span className="error-text">
                <DangerIcon />
                {errors.purchase_date.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Сумма</label>
            <input
              type="number"
              className={errors.amount ? "input-error" : ""}
              placeholder="Минимум 1000"
              {...register('amount')}
            />
            {errors.amount && (
              <span className="error-text">
                <DangerIcon />
                {errors.amount.message}
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
