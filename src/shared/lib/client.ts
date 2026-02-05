import { apiClient } from "@/shared/api";

/**
 * Legacy export for the shared HTTP client.
 *
 * This file now re-exports the canonical axios instance (`apiClient`)
 * from `@/shared/api/base` to avoid maintaining multiple clients.
 *
 * Prefer importing `apiClient` from `@/shared/api` in new code:
 *
 *   import { apiClient } from "@/shared/api";
 *
 * The `api` alias remains for backward compatibility:
 *
 *   import { api } from "@/shared/lib";
 */
export const api = apiClient;
