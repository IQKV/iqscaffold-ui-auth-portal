import { useCallback } from "react";
import { notificationService } from "./notifications";
import {
  normalizeAxiosError,
  shouldShowError,
  getRetryConfig,
  type AppError,
} from "./http-error";

export interface ErrorHandlerOptions {
  /**
   * Whether to show notification automatically
   * @default true
   */
  showNotification?: boolean;

  /**
   * Custom notification title
   */
  notificationTitle?: string;

  /**
   * Whether to show retry button for retryable errors
   * @default true
   */
  showRetryButton?: boolean;

  /**
   * Custom retry handler
   */
  onRetry?: () => void;

  /**
   * Custom error handler for specific error types
   */
  onError?: (error: AppError) => void;

  /**
   * Whether to log errors to console
   * @default true in development
   */
  logError?: boolean;
}

/**
 * Hook for handling errors with RFC 7807 support and Mantine notifications
 */
export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const {
    showNotification = true,
    notificationTitle,
    showRetryButton = true,
    onRetry,
    onError,
    logError = import.meta.env.DEV,
  } = options;

  const handleError = useCallback(
    (error: unknown) => {
      const appError = normalizeAxiosError(error);

      // Log error in development
      if (logError) {
        console.error("Error handled:", {
          type: appError.type,
          message: appError.message,
          status: appError.status,
          code: appError.code,
          requestId: appError.requestId,
          correlationId: appError.correlationId,
          retryable: appError.retryable,
          originalError: error,
        });
      }

      // Call custom error handler
      onError?.(appError);

      // Show notification if enabled and error should be shown
      if (showNotification && shouldShowError(error)) {
        const retryConfig = getRetryConfig(error);

        notificationService.errorFromAxios(error, {
          title: notificationTitle,
          showRetryButton: showRetryButton && retryConfig.retryable,
          onRetry,
        });
      }

      return appError;
    },
    [
      showNotification,
      notificationTitle,
      showRetryButton,
      onRetry,
      onError,
      logError,
    ]
  );

  return {
    handleError,
    /**
     * Handle error and return whether it's retryable
     */
    handleErrorWithRetry: useCallback(
      (error: unknown) => {
        const appError = handleError(error);
        const retryConfig = getRetryConfig(error);
        return {
          error: appError,
          retryable: retryConfig.retryable,
          retryDelay: retryConfig.delay,
          maxRetries: retryConfig.maxRetries,
        };
      },
      [handleError]
    ),
  };
}

/**
 * Hook specifically for React Query error handling
 */
export function useQueryErrorHandler(options: ErrorHandlerOptions = {}) {
  const { handleError } = useErrorHandler(options);

  return {
    onError: handleError,
  };
}

/**
 * Hook for mutation error handling with form integration
 */
export function useMutationErrorHandler(options: ErrorHandlerOptions = {}) {
  const { handleError } = useErrorHandler({
    ...options,
    // Don't show notification by default for mutations (handled by form)
    showNotification: options.showNotification ?? false,
  });

  return {
    onError: handleError,
  };
}
