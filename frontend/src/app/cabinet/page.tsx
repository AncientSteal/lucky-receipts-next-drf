"use client";

import { useEffect } from "react";
import CabinetScreen from "@/components/CabinetScreen";
import { useReceiptsStore } from "../store/useReceiptsStore";

export default function HomePage() {
  const fetchReceipts = useReceiptsStore((state) => state.fetchReceipts);

  useEffect(() => {
    fetchReceipts(1);
  }, [fetchReceipts]);

  return (
    <CabinetScreen />
  );
}