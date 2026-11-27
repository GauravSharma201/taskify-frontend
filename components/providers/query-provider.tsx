"use client";

import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { getQueryClient } from "@/lib/query/query-client";

/** Shares the TanStack Query cache with every client component below it. */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient(); // same object on every render in the browser
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Floating panel in dev; renders nothing in production builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
