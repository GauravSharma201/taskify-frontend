import { isAxiosError } from "axios";

/** One field error from the backend's validation body (shape A in docs/api_contracts/auth.md). */
export type ApiFieldError = { field: string; message: string };

type ApiErrorOptions = {
  status?: number | null;
  code?: string | null;
  fieldErrors?: ApiFieldError[];
};

/**
 * The only error type a caller of `apiClient` ever sees.
 * See docs/wiring/axios-setup.md.
 */
export class ApiError extends Error {
  /** HTTP status; null when no response came back (network, timeout, cancel). */
  readonly status: number | null;
  /** Backend code (e.g. "EMAIL_NOT_VERIFIED") or ours: NETWORK_ERROR, TIMEOUT, REQUEST_CANCELED. */
  readonly code: string | null;
  /** Field errors from a validation response; [] otherwise. */
  readonly fieldErrors: ApiFieldError[];

  constructor(message: string, { status = null, code = null, fieldErrors = [] }: ApiErrorOptions = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

const FALLBACK_MESSAGE = "Something went wrong. Try again.";

/** Converts any failure from an axios call into an `ApiError`. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error; // already converted
  if (!isAxiosError(error)) return new ApiError(FALLBACK_MESSAGE); // a bug in our code, not HTTP

  // No response at all: cancelled, timed out, or server unreachable / CORS blocked
  if (error.code === "ERR_CANCELED") {
    return new ApiError("Request cancelled.", { code: "REQUEST_CANCELED" });
  }
  if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
    return new ApiError("The server took too long to respond. Try again.", { code: "TIMEOUT" });
  }
  if (!error.response) {
    return new ApiError("Can’t reach the server. Check your connection and try again.", {
      code: "NETWORK_ERROR",
    });
  }

  const { status, data } = error.response;
  // 429 rate limit: body is plain text
  if (typeof data === "string") return new ApiError(data || FALLBACK_MESSAGE, { status });

  const body = (data ?? {}) as {
    message?: string;
    code?: string;
    error?: string;
    errors?: ApiFieldError[];
  };
  const fieldErrors = Array.isArray(body.errors) ? body.errors : []; // shape A
  const message =
    body.message ?? // shape B / C: { message }
    fieldErrors[0]?.message ?? // shape A: first field's message
    body.error ?? // malformed JSON: { success: false, error }
    FALLBACK_MESSAGE;

  return new ApiError(message, { status, code: body.code ?? null, fieldErrors });
}
