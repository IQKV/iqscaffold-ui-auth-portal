import axios, { AxiosError } from "axios";

export type AppErrorType =
  | "network"
  | "timeout"
  | "canceled"
  | "auth"
  | "validation"
  | "client"
  | "server"
  | "unknown";

export interface AppError {
  type: AppErrorType;
  message: string;
  status?: number;
  code?: string | number;
  details?: any;
  requestId?: string;
  correlationId?: string;
  retryable?: boolean;
  cause?: unknown;
}

/**
 * RFC 7807 Problem Details structure
 * @see https://tools.ietf.org/html/rfc7807
 */
export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  code?: string;
  method?: string;
  correlationId?: string;
  requestId?: string;
  fields?: Array<{
    field: string;
    rejectedValue?: any;
    message: string;
  }>;
}

function extractRequestId(from: any): string | undefined {
  const headers = (from?.headers ?? {}) as Record<
    string,
    string | string[] | undefined
  >;
  const id =
    headers["x-request-id"] ??
    headers["x-correlation-id"] ??
    headers.traceparent ??
    headers["x-amzn-trace-id"] ??
    undefined;
  if (Array.isArray(id)) {
    return id[0];
  }
  if (typeof id === "string") {
    return id;
  }
  return undefined;
}

function extractCorrelationId(from: any): string | undefined {
  const headers = (from?.headers ?? {}) as Record<
    string,
    string | string[] | undefined
  >;
  const id = headers["x-correlation-id"] ?? headers["correlation-id"];
  if (Array.isArray(id)) {
    return id[0];
  }
  if (typeof id === "string") {
    return id;
  }
  return undefined;
}

/**
 * Checks if the response data follows RFC 7807 Problem Details format
 */
function isProblemDetail(data: any): data is ProblemDetail {
  return (
    data &&
    typeof data === "object" &&
    (data.type !== undefined ||
      data.title !== undefined ||
      data.detail !== undefined ||
      data.status !== undefined)
  );
}

/**
 * Extracts error code from various response formats
 */
function extractErrorCode(data: any, axiosCode?: string): string | undefined {
  // RFC 7807 code property
  if (data?.code) {
    return String(data.code);
  }

  // Extract from type URI (e.g., "urn:problem:validation_error" -> "VALIDATION_ERROR")
  if (data?.type && typeof data.type === "string") {
    const match = data.type.match(/urn:problem:(.+)$/);
    if (match) {
      return match[1].toUpperCase().replace(/-/g, "_");
    }
  }

  return axiosCode;
}

function flattenValidationErrors(errors: any): string[] {
  if (!errors) {
    return [];
  }
  // If array of messages
  if (Array.isArray(errors)) {
    return errors.map(String);
  }
  // If object of field -> [messages]
  if (typeof errors === "object") {
    const out: string[] = [];
    for (const key of Object.keys(errors)) {
      const val = (errors as any)[key];
      if (Array.isArray(val)) {
        out.push(...val.map(String));
      } else if (typeof val === "string") {
        out.push(val);
      } else if (val && typeof val === "object") {
        out.push(...flattenValidationErrors(val));
      }
    }
    return out;
  }
  return [String(errors)];
}

export function normalizeAxiosError(err: unknown): AppError {
  // Axios cancellation
  if (axios.isCancel(err)) {
    return {
      type: "canceled",
      message: "Request was canceled",
      code: (err as any)?.code,
      cause: err,
      retryable: false,
    };
  }

  const isAxios = axios.isAxiosError(err);
  const ax = err as AxiosError;

  // Network or timeout
  if (isAxios && !ax.response) {
    const code = ax.code;
    const isTimeout =
      code === "ECONNABORTED" || /timeout/i.test(ax.message || "");
    return {
      type: isTimeout ? "timeout" : "network",
      message: isTimeout
        ? "Request timed out. Please try again."
        : "Network error. Please check your connection and try again.",
      code,
      cause: err,
      retryable: true,
      requestId: extractRequestId(ax),
    };
  }

  if (isAxios && ax.response) {
    const { status, data } = ax.response as { status: number; data: any };
    const hdrRequestId = extractRequestId(ax.response as any);
    const hdrCorrelationId = extractCorrelationId(ax.response as any);

    // Handle RFC 7807 Problem Details format
    if (isProblemDetail(data)) {
      return handleProblemDetail(
        data,
        status,
        hdrRequestId,
        hdrCorrelationId,
        err
      );
    }

    // Fallback to legacy error handling for non-RFC 7807 responses
    return handleLegacyError(
      data,
      status,
      ax,
      hdrRequestId,
      hdrCorrelationId,
      err
    );
  }

  // Non-axios or unknown error
  const anyErr = err as any;
  return {
    type: "unknown",
    message: anyErr?.message || "An unexpected error occurred",
    code: anyErr?.code,
    cause: err,
    retryable: false,
  };
}

/**
 * Handles RFC 7807 Problem Details responses
 */
function handleProblemDetail(
  data: ProblemDetail,
  status: number,
  requestId?: string,
  correlationId?: string,
  cause?: unknown
): AppError {
  const type = determineErrorType(status, data.code);
  const retryable = isRetryableError(status, data.code);

  // Use RFC 7807 fields for message construction
  const message = constructProblemDetailMessage(data);

  return {
    type,
    message,
    status,
    code: extractErrorCode(data),
    details: data,
    requestId: requestId || data.requestId,
    correlationId: correlationId || data.correlationId,
    retryable,
    cause,
  };
}

/**
 * Handles legacy (non-RFC 7807) error responses
 */
function handleLegacyError(
  data: any,
  status: number,
  ax: AxiosError,
  requestId?: string,
  correlationId?: string,
  cause?: unknown
): AppError {
  const type = determineErrorType(status);
  const retryable = isRetryableError(status);

  // Try to extract message from various legacy formats
  const message =
    (typeof data === "string" ? data : undefined) ??
    data?.message ??
    data?.detail ??
    data?.error_description ??
    data?.error ??
    data?.title ??
    ax.message ??
    "Request failed";

  const errors = flattenValidationErrors(
    data?.errors ?? data?.violations ?? data?.fields
  );

  const combinedMessage = errors.length
    ? `${message}. ${errors.join(", ")}`
    : message;

  return {
    type: errors.length && type === "client" ? "validation" : type,
    message: combinedMessage,
    status,
    code: extractErrorCode(data, ax.code),
    details: data,
    requestId,
    correlationId,
    retryable,
    cause,
  };
}

/**
 * Constructs user-friendly message from RFC 7807 Problem Details
 */
function constructProblemDetailMessage(data: ProblemDetail): string {
  // Start with title or detail
  let message = data.title || data.detail || "An error occurred";

  // Add field-specific errors if present
  if (data.fields && data.fields.length > 0) {
    const fieldMessages = data.fields.map(
      (field) => `${field.field}: ${field.message}`
    );
    message += `. ${fieldMessages.join(", ")}`;
  }

  return message;
}

/**
 * Determines error type based on HTTP status and error code
 */
function determineErrorType(status: number, code?: string): AppErrorType {
  // Check specific error codes first
  if (code) {
    const upperCode = code.toUpperCase();
    if (upperCode.includes("AUTH") || upperCode.includes("UNAUTHORIZED")) {
      return "auth";
    }
    if (upperCode.includes("VALIDATION") || upperCode.includes("INVALID")) {
      return "validation";
    }
    if (upperCode.includes("TIMEOUT")) {
      return "timeout";
    }
  }

  // Fallback to HTTP status codes
  if (status === 401 || status === 403) {
    return "auth";
  } else if (status === 400 || status === 422) {
    return "validation";
  } else if (status === 404) {
    return "client";
  } else if (status === 408) {
    return "timeout";
  } else if (status === 429) {
    return "server";
  } else if (status >= 500) {
    return "server";
  } else if (status >= 400) {
    return "client";
  }

  return "unknown";
}

/**
 * Determines if an error is retryable based on status and code
 */
function isRetryableError(status: number, code?: string): boolean {
  // Network timeouts are retryable
  if (status === 408 || code?.toUpperCase().includes("TIMEOUT")) {
    return true;
  }

  // Rate limiting is retryable
  if (status === 429) {
    return true;
  }

  // Server errors are generally retryable
  if (status >= 500) {
    return true;
  }

  // Client errors are generally not retryable
  return false;
}

export type FieldErrors = Record<string, string[]>;

function normalizeFieldKey(key: string): string {
  if (!key) {
    return key;
  }
  // Convert propertyPath like "user.email" -> "email"
  const parts = key.split(".");
  const last = parts[parts.length - 1];
  // Unify common backend variants to our snake_case form field names
  if (last === "passwordConfirmation" || last === "password-confirmation") {
    return "password_confirmation";
  }
  return last;
}

export function getFieldErrors(err: unknown): FieldErrors {
  const appErr = normalizeAxiosError(err);
  const data = appErr.details;
  const out: FieldErrors = {};
  if (!data) {
    return out;
  }

  // RFC 7807 Problem Details fields array
  if (isProblemDetail(data) && data.fields) {
    for (const fieldError of data.fields) {
      const field = normalizeFieldKey(fieldError.field);
      if (field) {
        (out[field] = out[field] || []).push(fieldError.message);
      }
    }
  }

  // Legacy RFC7807-style violations: [{ field/propertyPath, message }]
  const violations = data?.violations as Array<Record<string, any>> | undefined;
  if (Array.isArray(violations)) {
    for (const v of violations) {
      const field = normalizeFieldKey(
        v?.field || v?.propertyPath || v?.name || ""
      );
      const msg =
        v?.message || v?.reason || v?.detail || v?.error || "Invalid value";
      if (!field) {
        continue;
      }
      (out[field] = out[field] || []).push(String(msg));
    }
  }

  // Legacy errors: { field: [messages] } or { field: "message" }
  const errorsObj = data?.errors as Record<string, unknown> | undefined;
  if (errorsObj && typeof errorsObj === "object" && !Array.isArray(errorsObj)) {
    for (const key of Object.keys(errorsObj)) {
      const field = normalizeFieldKey(key);
      const val = errorsObj[key];
      if (Array.isArray(val)) {
        (out[field] = out[field] || []).push(...val.map(String));
      } else if (val != null) {
        (out[field] = out[field] || []).push(String(val));
      }
    }
  }

  return out;
}

export function toMantineErrors(err: unknown): Record<string, string> {
  const map = getFieldErrors(err);
  const res: Record<string, string> = {};
  for (const k of Object.keys(map)) {
    if (map[k] && map[k].length) {
      res[k] = map[k][0];
    }
  }
  return res;
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  const appErr = normalizeAxiosError(err);
  let message = appErr.message || fallback;

  // Include reference ID for server/unknown errors to aid debugging
  const refId = appErr.correlationId || appErr.requestId;
  if (refId && (appErr.type === "server" || appErr.type === "unknown")) {
    message += ` (ref: ${refId})`;
  }

  return message;
}

/**
 * Gets a user-friendly error title based on error type
 */
export function getErrorTitle(err: unknown): string {
  const appErr = normalizeAxiosError(err);

  switch (appErr.type) {
    case "network":
      return "Connection Error";
    case "timeout":
      return "Request Timeout";
    case "auth":
      return "Authentication Error";
    case "validation":
      return "Validation Error";
    case "server":
      return "Server Error";
    case "client":
      return "Request Error";
    case "canceled":
      return "Request Canceled";
    default:
      return "Error";
  }
}

/**
 * Determines if an error should be shown to the user
 */
export function shouldShowError(err: unknown): boolean {
  const appErr = normalizeAxiosError(err);

  // Don't show canceled requests
  if (appErr.type === "canceled") {
    return false;
  }

  // Always show other errors
  return true;
}

/**
 * Gets retry configuration for an error
 */
export function getRetryConfig(err: unknown): {
  retryable: boolean;
  delay?: number;
  maxRetries?: number;
} {
  const appErr = normalizeAxiosError(err);

  if (!appErr.retryable) {
    return { retryable: false };
  }

  switch (appErr.type) {
    case "timeout":
      return { retryable: true, delay: 1000, maxRetries: 3 };
    case "network":
      return { retryable: true, delay: 2000, maxRetries: 2 };
    case "server":
      // Rate limiting gets longer delay
      if (appErr.status === 429) {
        return { retryable: true, delay: 5000, maxRetries: 2 };
      }
      return { retryable: true, delay: 3000, maxRetries: 1 };
    default:
      return { retryable: false };
  }
}
