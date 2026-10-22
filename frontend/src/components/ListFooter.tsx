import Link from "next/link";
import { ReceiptIcon, WarningIcon } from "./Icons";

interface ListFooterProps {
  count: number;
}

export default function ListFooter({ count }: ListFooterProps) {
  const footerClassName = `list-footer ${count === 0 ? "one" : ""}`;
  return (
    <div className={footerClassName}>
      {count > 0 && (
        <div className="list-footer_info">
          <WarningIcon />
          <p>Иногда проверка вашего чека может занять до 5 рабочих дней</p>
        </div>
      )}
      <Link href="/form" className="registration-btn button-navigation">
        <ReceiptIcon /> Зарегистрировать чек
      </Link>
    </div>
  );
}
