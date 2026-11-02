"use client";
import "@/components/ReceiptForm.css";
import { useRouter } from "next/navigation";
import { useReceiptsStore } from "@/app/store/useReceiptsStore";
import ReceiptForm from "@/components/ReceiptForm";

export default function FormPage() {
  const router = useRouter();

  const handleFormSuccess = () => {
    useReceiptsStore.getState().fetchReceipts(1); // Вызов напрямую из стора
    router.push("/form/success");
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
    </>
  );
}