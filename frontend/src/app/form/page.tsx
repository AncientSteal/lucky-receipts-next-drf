"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useReceiptsStore } from "@/app/store/useReceiptsStore";
import ReceiptForm from "@/components/ReceiptForm";
import SuccessModal from "@/components/SuccessModal";

export default function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchReceipts = useReceiptsStore((state) => state.fetchReceipts);

  const isSuccess = searchParams.get("success") === "true";

  const handleFormSuccess = () => {
    fetchReceipts(1); 
    router.push("/form?success=true"); 
  };

  const handleCloseModal = () => {
    router.push("/"); 
  };

  return (
    <>
      <ReceiptForm
        onSuccess={handleFormSuccess}
        onClose={handleCloseModal}
      />

      {isSuccess && (
        <SuccessModal onClose={handleCloseModal} />
      )}
    </>
  );
}