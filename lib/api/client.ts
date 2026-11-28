import axios from "axios";

import { toApiError } from "./errors";

// Written out in full so Next.js can inline it into the browser bundle.
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not set. Copy .env.example to .env.local.");
}

/**
 * The one HTTP client for the backend. Every call rejects with an `ApiError`.
 * See docs/wiring/axios-setup.md.
 */
export const apiClient = axios.create({
  baseURL, // e.g. "http://localhost:3000/api/v1"
  withCredentials: true, // send + accept the httpOnly login cookies
  timeout: 15_000, // give up after 15 s → ApiError code "TIMEOUT"
  headers: { "Content-Type": "application/json" },
});

// Runs after every response, before the caller's await returns
apiClient.interceptors.response.use(
  (response) => response, // 2xx: pass through
  (error) => Promise.reject(toApiError(error)), // anything else: one error shape
);
