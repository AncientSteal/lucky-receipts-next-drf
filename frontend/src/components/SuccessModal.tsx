import { SuccessIcon } from "./Icons";

interface SuccessModalProps {
  onClose: () => void;
}

export default function SuccessModal({ onClose }: SuccessModalProps) {
    return (
        <div className="modal-container">
            <div className="modal-content">
                <SuccessIcon />
                <h3>
                    Ваш чек загружен
                </h3>
                <p>
                    Мы уже начали анализировать ваши покупки. 
                    Это займет всего пару секунд
                </p>
            </div>
            <button className="registration-btn" onClick={onClose}>
                На главную
            </button>
        </div>
    );
}