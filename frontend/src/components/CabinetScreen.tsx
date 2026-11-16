import { useReceiptsStore } from "@/app/store/useReceiptsStore";
import ReceiptsList from "./ReceiptList";
import Pagination from "./Pagination";
import ListFooter from "./ListFooter";
import "./CabinetScreen.css";
import { useUserStore } from "@/app/store/useUserStore";

export default function CabinetScreen() {
  const receipts = useReceiptsStore((state) => state.receipts);
  const count = useReceiptsStore((state) => state.count);
  const page = useReceiptsStore((state) => state.page);
  const receiptsLoading = useReceiptsStore((state) => state.loading);
  const setPage = useReceiptsStore((state) => state.setPage);
  const user = useUserStore((state) => state.user);
  const isUserInitialized = useUserStore((state) => state.isInitialized);

  const isLoading = !isUserInitialized || receiptsLoading;

  return (
    <section className="screen-cabinet">
      <div className="list-header">
        <h3>История чеков</h3>
        {user && (
          <div className="list-count">
            <p>
              Чеков внесено: <span>{count} шт.</span>
            </p>
          </div>
        )}
      </div>

      <ReceiptsList receipts={receipts} loading={isLoading} user={user}/>

      {!isLoading && (
        <Pagination count={count} currentPage={page} setPage={setPage} />
      )}

      {!isLoading && user && <ListFooter count={count} />}
    </section>
  );
}
