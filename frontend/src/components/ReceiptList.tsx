import Image from "next/image";
import { Receipt } from "@/app/store/useReceiptsStore";
import { AcceptedStatusIcon, CalendarIcon, CheckingStatusIcon, MoneyIcon, RejectedStatusIcon } from "./Icons";
import "./ReceiptList.css";

type ReceiptStatus = "accepted" | "rejected" | "checking";

export interface ExtendedReceipt extends Receipt {
  status: ReceiptStatus;
  status_display: string;
  registration_date: string;
  reject_reason?: string;
}

interface ReceiptsListProps {
  receipts: ExtendedReceipt[];
  loading: boolean;
}

export default function ReceiptsList({ receipts, loading }: ReceiptsListProps) {
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

  // Функция для подбора CSS-класса под статус чека
  const getStatusClass = (status: ReceiptStatus) => {
    switch (status) {
      case 'accepted': return 'status-accepted';
      case 'rejected': return 'status-rejected';
      default: return 'status-checking';
    }
  };

  const getStatusIcon = (status: ReceiptStatus) => {
    switch (status) {
      case 'accepted': return <AcceptedStatusIcon />;
      case 'rejected': return <RejectedStatusIcon />;
      default: return <CheckingStatusIcon />;
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
            {receipts.map((receipt) => (
              <tr key={receipt.id}>
                <td>{formatDate(receipt.purchase_date)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(receipt.status)}`}>
                    {getStatusIcon(receipt.status)}
                    {receipt.status_display}
                  </span>
                </td>
                <td className="amount-cell">
                  <MoneyIcon /> {parseFloat(String(receipt.amount)).toLocaleString('ru-RU')} ₽
                </td>
                <td>
                  <CalendarIcon />{formatDate(receipt.registration_date)}
                </td>
                <td className="reason-cell">
                  {receipt.status === 'rejected' ? receipt.reject_reason : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}