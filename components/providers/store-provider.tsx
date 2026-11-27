"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";

import { getStore } from "@/lib/store/store";

/** Shares the Redux store with every client component below it. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const store = getStore(); // same object on every render in the browser
  return <Provider store={store}>{children}</Provider>;
}
