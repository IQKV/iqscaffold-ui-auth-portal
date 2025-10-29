import React from "react";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
  IconWifi,
  IconClock,
  IconShield,
  IconExclamationMark,
} from "@tabler/icons-react";
import {
  normalizeAxiosError,
  getErrorMessage,
  getErrorTitle,
  shouldShowError,
  type AppError,
  type AppErrorType,
} from "./http-error";

interface NotificationOptions {
  title?: string;
  message: string;
  autoClose?: number | false;
}

interface ErrorNotificationOptions {
  title?: string;
  autoClose?: number | false;
  showRetryButton?: boolean;
  onRetry?: () => void;
}

/**
 * Gets appropriate icon for error type
 */
function getErrorIcon(errorType: AppErrorType): React.ReactNode {
  switch (errorType) {
    case "network":
      return <IconWifi size="1rem" />;
    case "timeout":
      return <IconClock size="1rem" />;
    case "auth":
      return <IconShield size="1rem" />;
    case "validation":
      return <IconExclamationMark size="1rem" />;
    case "server":
    case "client":
    case "unknown":
    default:
      return <IconX size="1rem" />;
  }
}

/**
 * Gets appropriate color for error type
 */
function getErrorColor(errorType: AppErrorType): string {
  switch (errorType) {
    case "network":
    case "timeout":
      return "orange";
    case "auth":
      return "grape";
    case "validation":
      return "yellow";
    case "server":
    case "client":
    case "unknown":
    default:
      return "red";
  }
}

/**
 * Gets appropriate auto-close duration for error type
 */
function getErrorAutoClose(errorType: AppErrorType): number | false {
  switch (errorType) {
    case "network":
    case "timeout":
      return 8000; // Longer for network issues
    case "validation":
      return false; // Keep validation errors visible
    case "auth":
      return 10000; // Longer for auth issues
    case "server":
      return 8000;
    default:
      return 6000;
  }
}

export const notificationService = {
  success: ({
    title = "Success",
    message,
    autoClose = 4000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "green",
      icon: <IconCheck size="1rem" />,
      autoClose,
    });
  },

  error: ({
    title = "Error",
    message,
    autoClose = 6000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "red",
      icon: <IconX size="1rem" />,
      autoClose,
    });
  },

  /**
   * Enhanced error notification that handles axios errors with RFC 7807 support
   */
  errorFromAxios: (error: unknown, options: ErrorNotificationOptions = {}) => {
    const appError = normalizeAxiosError(error);

    // Don't show notification for canceled requests
    if (!shouldShowError(error)) {
      return;
    }

    const title = options.title || getErrorTitle(error);
    const message = getErrorMessage(error);
    const autoClose = options.autoClose ?? getErrorAutoClose(appError.type);
    const color = getErrorColor(appError.type);
    const icon = getErrorIcon(appError.type);

    const notificationId = `error-${Date.now()}`;

    notifications.show({
      id: notificationId,
      title,
      message,
      color,
      icon,
      autoClose,
      withCloseButton: true,
      // Add retry action for retryable errors
      ...(appError.retryable &&
        options.onRetry && {
          action: {
            label: "Retry",
            onClick: () => {
              notifications.hide(notificationId);
              options.onRetry?.();
            },
          },
        }),
    });

    return notificationId;
  },

  warning: ({
    title = "Warning",
    message,
    autoClose = 5000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "yellow",
      icon: <IconAlertTriangle size="1rem" />,
      autoClose,
    });
  },

  info: ({
    title = "Info",
    message,
    autoClose = 4000,
  }: NotificationOptions) => {
    notifications.show({
      title,
      message,
      color: "blue",
      icon: <IconInfoCircle size="1rem" />,
      autoClose,
    });
  },

  loading: ({
    title = "Loading",
    message,
  }: Omit<NotificationOptions, "autoClose">) => {
    return notifications.show({
      id: "loading",
      title,
      message,
      loading: true,
      autoClose: false,
      withCloseButton: false,
    });
  },

  updateLoading: (
    id: string,
    {
      title,
      message,
      type = "success",
    }: NotificationOptions & { type?: "success" | "error" }
  ) => {
    const config = {
      success: { color: "green", icon: <IconCheck size="1rem" /> },
      error: { color: "red", icon: <IconX size="1rem" /> },
    };

    notifications.update({
      id,
      title,
      message,
      loading: false,
      autoClose: 4000,
      ...config[type],
    });
  },

  hide: (id: string) => {
    notifications.hide(id);
  },

  clean: () => {
    notifications.clean();
  },
};
