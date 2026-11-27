import { environmentManager, QueryClient } from "@tanstack/react-query";

import type { ApiError } from "@/lib/api/errors";

// Every queryFn / mutationFn calls apiClient, which only rejects with ApiError.
// This makes `useQuery(...).error` typed ApiError instead of unknown.
declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}

const MAX_RETRIES = 2;

/** Retry only failures that might succeed next time: network, timeout, 5xx. */
function shouldRetry(failureCount: number, error: ApiError): boolean {
  if (failureCount >= MAX_RETRIES) return false;
  if (error.code === "REQUEST_CANCELED") return false; // we cancelled it on purpose
  if (error.status !== null && error.status < 500) return false; // 4xx: same request, same answer
  return true; // NETWORK_ERROR, TIMEOUT, 5xx
}

/**
 * A QueryClient with Taskify's defaults.
 * See docs/wiring/tanstack-query-setup.md.
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // data counts as fresh for 1 min → no refetch on remount
        // gcTime stays at the default 5 min: unused data is deleted after that
        retry: shouldRetry,
      },
      mutations: {
        retry: false, // never repeat a create/update by itself (could create duplicates)
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** The QueryClient to use: one per server request, one per browser tab. */
export function getQueryClient() {
  // Server render: a fresh client per request, so users never share a cache
  if (environmentManager.isServer()) return makeQueryClient();
  // Browser: create once, reuse for the life of the tab
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
