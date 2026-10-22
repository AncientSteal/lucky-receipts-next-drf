import { useReceiptsStore } from "@/app/store/useReceiptsStore";
import ReceiptsList from "./ReceiptList";
import Pagination from "./Pagination";
import ListFooter from "./ListFooter";
import "./CabinetScreen.css";

export default function CabinetScreen() {
  const receipts = useReceiptsStore((state) => state.receipts);
  const count = useReceiptsStore((state) => state.count);
  const page = useReceiptsStore((state) => state.page);
  const loading = useReceiptsStore((state) => state.loading);
  const setPage = useReceiptsStore((state) => state.setPage);

  return (
    <section className="screen-cabinet">
      <div className="list-header">
        <h3>История чеков</h3>
        <div className="list-count">
          <p>
            Чеков внесено: <span>{count} шт.</span>
          </p>
        </div>
      </div>

      <ReceiptsList receipts={receipts} loading={loading} />

      {!loading && (
        <Pagination count={count} currentPage={page} setPage={setPage} />
      )}

      <ListFooter count={count} />
    </section>
  );
}
