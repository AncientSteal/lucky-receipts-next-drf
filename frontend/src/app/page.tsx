"use client";

import { useReceiptsStore } from "./store/useReceiptsStore";
import { useEffect } from "react";
import CabinetScreen from "@/components/CabinetScreen";

export default function HomePage() {
  const fetchReceipts = useReceiptsStore((state) => state.fetchReceipts);

  useEffect(() => {
    fetchReceipts(1);
  }, [fetchReceipts]);

  return (
    <CabinetScreen />
  );
}
