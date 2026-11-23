import Image from "next/image";
import { AcceptedStatusIcon, CalendarIcon, CheckingStatusIcon, MoneyIcon, RejectedStatusIcon } from "./Icons";
import "./ReceiptList.css";
import { ExtendedReceipt, ReceiptStatus } from "@/schemas/receipt.schema";
import { User } from "@/schemas/user.schema";
import Link from "next/link";

interface ReceiptsListProps {
  receipts: ExtendedReceipt[];
  loading: boolean;
  user: User | null;
}

// форматтеры создаются один раз при инициализации
const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const amountFormatter = new Intl.NumberFormat('ru-RU');

const formatDate = (dateString: string): string => {
  return dateFormatter.format(new Date(dateString));
};

// хэлпер чтобы подобрать класс / икнонку по статусу
const STATUS_CONFIG: Record<string, { className: string; icon: React.ReactNode }> = {
  accepted: { className: 'status-accepted', icon: <AcceptedStatusIcon /> },
  rejected: { className: 'status-rejected', icon: <RejectedStatusIcon /> },
  checking: { className: 'status-checking', icon: <CheckingStatusIcon /> },
};

export default function ReceiptsList({ receipts, loading, user }: ReceiptsListProps) {
  if (user === null) return (
    <div className="empty-container">
      <div className="empty-list-img">
        <Image
          src="/images/empty.svg"
          alt="Требуется авторизация"
          width={120}
          height={120}
          priority
        />
      </div>
      <div className="empty-list-text">
        <h3>Вы пока не вошли в аккаунт</h3>
        <p>Авторизуйтесь или зарегистрируйтесь, чтобы добавлять чеки и следить за их статусом проверки</p>
        <Link href="/login" className="auth-prompt-btn">
          Войти в аккаунт
        </Link>
      </div>
    </div>
  );
  if (loading) return <div className="loading">Загрузка данных...</div>;
  if (receipts.length === 0) return (
    <div className="empty-container">
      <div className="empty-list-img">
        <Image 
          src="/images/empty.svg" 
          alt="Empty list icon" 
          width={120}
          height={120}
          priority
        />
      </div>
      <div className="empty-list-text">
        <h3>Здесь будет история ваших чеков</h3>
        <p>Вы не добавили еще ни одного чека</p>
      </div>
    </div>
  );

  return (
      <div className="table-container">
        <table className="receipts-table">
          <thead>
            <tr>
              <th>Дата покупки</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th>Дата регистрации</th>
              <th>Информация</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => {
              const statusInfo = STATUS_CONFIG[receipt.status] ?? STATUS_CONFIG.checking;
              return (
                <tr key={receipt.id}>
                  <td>{formatDate(receipt.purchase_date)}</td>
                  <td>
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.icon}
                      {receipt.status_display}
                    </span>
                  </td>
                  <td className="amount-cell">
                    <MoneyIcon /> {amountFormatter.format(Number(receipt.amount))} ₽
                  </td>
                  <td>
                    <CalendarIcon />{formatDate(receipt.registration_date)}
                  </td>
                  <td className="reason-cell">
                    {receipt.status === 'rejected' ? receipt.reject_reason : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
  );
}