import { useReceiptsStore } from "@/app/store/useReceiptsStore";
import ReceiptsList from "./ReceiptList";
import Pagination from "./Pagination";
import ListFooter from "./ListFooter";
import "./CabinetScreen.css";
import { useReceiptsQuery } from "@/app/hooks/useReceiptsQuery";
import { useUserQuery } from "@/app/hooks/useUser";

export default function CabinetScreen() {
  const page = useReceiptsStore((state) => state.page);
  const setPage = useReceiptsStore((state) => state.setPage);
  const { data: user = null, isPending: isUserLoading } = useUserQuery();
  const {
    data,
    isPending: receiptsLoading,
    isFetching,
    error,
  } = useReceiptsQuery(page, user?.id);

  // Достаём массив и счётчик с сэйвовыми значениями
  const receipts = data?.results ?? [];
  const count = data?.count ?? 0;

  const isLoading = isUserLoading || receiptsLoading;

  return (
    <section className="screen-cabinet">
      <div className="list-header">
        <h3>История чеков</h3>
        {!isLoading && user && (
          <div className="list-count">
            <p>
              Чеков внесено: <span>{count} шт.</span>
            </p>
          </div>
        )}
      </div>

      <ReceiptsList receipts={receipts} loading={isLoading} user={user}/>

      {!isLoading && user && (
        <>
          <Pagination count={count} currentPage={page} setPage={setPage} />
          <ListFooter count={count} />
        </>
      )}

    </section>
  );
}
