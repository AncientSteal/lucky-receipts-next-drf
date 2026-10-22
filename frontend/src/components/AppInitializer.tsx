"use client";
// Компонент, который просто вызовет fetchUser при старте

import { useEffect } from "react";
import { useUserStore } from "@/app/store/useUserStore";

export function AppInitializer() {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return null;
}