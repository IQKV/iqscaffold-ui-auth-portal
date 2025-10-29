import {
  normalizeAxiosError,
  getErrorTitle,
  getErrorMessage,
  getRetryConfig,
  type AppError,
} from "./http-error";
import { notificationService } from "./notifications";

/**
 * Handles authentication errors by redirecting to login
 */
export function handleAuthError(error: unknown, redirectToLogin?: () => void) {
  const appError = normalizeAxiosError(error);

  if (appError.type === "auth") {
    if (redirectToLogin) {
      redirectToLogin();
    } else {
      // Default behavior - show notification and reload page
      notificationService.error({
        title: "Authentication Required",
        message: "Please log in to continue",
        autoClose: false,
      });

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
    return true;
  }

  return false;
}

/**
 * Handles network errors with automatic retry
 */
export function handleNetworkError(
  error: unknown,
  onRetry: () => void,
  options: {
    maxRetries?: number;
    currentRetry?: number;
    showNotification?: boolean;
  } = {}
) {
  const appError = normalizeAxiosError(error);
  const retryConfig = getRetryConfig(error);
  const {
    maxRetries = retryConfig.maxRetries || 3,
    currentRetry = 0,
    showNotification = true,
  } = options;

  if (appError.type === "network" || appError.type === "timeout") {
    if (currentRetry < maxRetries) {
      // Show notification about retry
      if (showNotification) {
        notificationService.info({
          title: "Connection Issue",
          message: `Retrying... (${currentRetry + 1}/${maxRetries})`,
          autoClose: 2000,
        });
      }

      // Retry after delay
      setTimeout(() => {
        onRetry();
      }, retryConfig.delay || 1000);

      return true;
    }
    // Max retries reached
    if (showNotification) {
      notificationService.error({
        title: "Connection Failed",
        message:
          "Unable to connect after multiple attempts. Please check your internet connection.",
        autoClose: false,
      });
    }
  }

  return false;
}

/**
 * Handles validation errors by focusing on the first invalid field
 */
export function handleValidationError(
  error: unknown,
  form?: {
    setErrors: (errors: Record<string, string>) => void;
    getInputNode: (field: string) => HTMLElement | null;
  }
) {
  const appError = normalizeAxiosError(error);

  if (appError.type === "validation" && form) {
    // This would be handled by the form mutation hook
    // But we can add additional logic here if needed

    // Focus on first error field
    const errorData = appError.details;
    if (errorData?.fields && Array.isArray(errorData.fields)) {
      const firstField = errorData.fields[0]?.field;
      if (firstField) {
        const inputNode = form.getInputNode(firstField);
        inputNode?.focus();
      }
    }

    return true;
  }

  return false;
}

/**
 * Generic error handler that routes to appropriate specific handlers
 */
export function handleError(
  error: unknown,
  options: {
    onRetry?: () => void;
    redirectToLogin?: () => void;
    form?: {
      setErrors: (errors: Record<string, string>) => void;
      getInputNode: (field: string) => HTMLElement | null;
    };
    showNotification?: boolean;
    maxRetries?: number;
    currentRetry?: number;
  } = {}
) {
  const {
    onRetry,
    redirectToLogin,
    form,
    showNotification = true,
    maxRetries,
    currentRetry,
  } = options;

  // Try specific handlers first
  if (handleAuthError(error, redirectToLogin)) {
    return;
  }

  if (handleValidationError(error, form)) {
    return;
  }

  if (
    onRetry &&
    handleNetworkError(error, onRetry, {
      maxRetries,
      currentRetry,
      showNotification,
    })
  ) {
    return;
  }

  // Fallback to notification
  if (showNotification) {
    notificationService.errorFromAxios(error, { onRetry });
  }
}
