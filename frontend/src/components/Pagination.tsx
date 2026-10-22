import { useMemo } from "react";
import { PaginationIcon } from "./Icons";
import "./Pagination.css";

interface PaginationProps {
  count: number;
  currentPage: number;
  setPage: (page: number) => void;
}

export default function Pagination({ count, currentPage, setPage }: PaginationProps) {
  if (count <= 0) return null;

  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);

  if (totalPages <= 1) return null;

  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    
    // Если страниц мало (меньше 7) — показываем их все
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Если страниц много
    pages.push(1); // Первая всегда видна

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) pages.push("...");

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) pages.push("...");

    pages.push(totalPages); // Последняя всегда видна
    return pages;
  }, [count, currentPage, totalPages]);

  return (
    <div className="pagination-container">
      <button
        className="pag-btn pag-prev"
        disabled={currentPage === 1}
        onClick={() => {
          setPage(currentPage - 1);
        }}
      >
        <PaginationIcon />
      </button>

      <div className="pag-numbers">
        {visiblePages.map((page, index) => {
          if (page === "...") {
            // Многоточие — это просто текст, а не кнопка
            return <span key={`dots-${index}`} className="pag-dots">...</span>;
          }

          return (
            <button
              key={page}
              className={`pag-btn num-btn ${currentPage === page ? "active" : ""}`}
              onClick={() => setPage(page as number)}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pag-btn pag-next"
        disabled={currentPage === totalPages}
        onClick={() => {
          setPage(currentPage + 1);
        }}
      >
        <PaginationIcon />
      </button>
    </div>
  );
}
