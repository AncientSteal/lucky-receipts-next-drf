"use client";

import { useRouter } from "next/navigation";
import { CloseIcon, SuccessIcon } from "@/components/Icons";

export default function SuccessModalPage() {
  const router = useRouter();

  const handleClose = () => {
    // Возвращаем пользователя на страницу формы
    router.back();
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    // Добавляем backdrop для закрытия по клику вне окна
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <button
            type="button"
            className="close-form-btn"
            onClick={handleClose}
            aria-label="Закрыть форму"
          >
            <CloseIcon />
          </button>
          <SuccessIcon />
          <h3>Ваш чек загружен</h3>
          <p>
            Мы уже начали анализировать ваши покупки. Это займет всего пару
            секунд
          </p>
        </div>
        <button className="registration-btn" onClick={handleHome}>
          На главную
        </button>
      </div>
    </div>
  );
}
