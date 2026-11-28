import { apiClient } from "../client";

/*
 * Auth endpoint functions. Contract: docs/api_contracts/auth.md.
 * Each function shapes one HTTP call and returns the response body. Call them only from a
 * component's useMutation / useQuery, never directly in an event handler or useEffect.
 */

/** Body of POST /auth/register. */
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  organisationName: string;
  termsAccepted: boolean;
};

/** 201 body of POST /auth/register. IDs are strings (64-bit in the DB). */
export type RegisterResponse = {
  message: string;
  user: { id: string; name: string; email: string };
  organisation: { id: string; name: string };
};

/** Creates a user and their organisation. The user is not logged in afterwards; no cookies are set. */
export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  // POST <NEXT_PUBLIC_API_BASE_URL>/auth/register
  const { data } = await apiClient.post<RegisterResponse>("/auth/register", body);
  return data;
}
