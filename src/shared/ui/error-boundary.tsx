import React, { Component, type ErrorInfo, type ReactNode } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  Alert,
  Code,
} from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import {
  normalizeAxiosError,
  getErrorTitle,
  getErrorMessage,
} from "../lib/http-error";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Custom fallback component
   */
  fallback?: (
    error: Error,
    errorInfo: ErrorInfo,
    retry: () => void
  ) => ReactNode;
  /**
   * Called when an error is caught
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Whether to show error details in development
   * @default true in development
   */
  showErrorDetails?: boolean;
}

/**
 * Error boundary component with RFC 7807 error handling support
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error
    console.error("Error caught by boundary:", error, errorInfo);

    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { fallback, showErrorDetails = import.meta.env.DEV } = this.props;
      const { error, errorInfo } = this.state;

      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, errorInfo!, this.handleRetry);
      }

      // Try to normalize the error if it's an axios error
      const normalizedError = normalizeAxiosError(error);
      const title = getErrorTitle(error);
      const message = getErrorMessage(error, "An unexpected error occurred");

      return (
        <Container size="sm" py="xl">
          <Stack gap="lg" align="center">
            <IconAlertTriangle size={64} color="var(--mantine-color-red-6)" />

            <Stack gap="sm" align="center">
              <Title order={2} ta="center">
                {title}
              </Title>
              <Text size="lg" c="dimmed" ta="center">
                {message}
              </Text>
            </Stack>

            {normalizedError.requestId && (
              <Alert
                variant="light"
                color="blue"
                icon={<IconAlertTriangle size="1rem" />}
              >
                <Text size="sm">
                  Reference ID: <Code>{normalizedError.requestId}</Code>
                </Text>
              </Alert>
            )}

            <Button
              leftSection={<IconRefresh size="1rem" />}
              onClick={this.handleRetry}
              variant="filled"
            >
              Try Again
            </Button>

            {showErrorDetails && (
              <Alert variant="light" color="gray" style={{ width: "100%" }}>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>
                    Error Details (Development)
                  </Text>
                  <Code block>{error.message}</Code>
                  {errorInfo && (
                    <Code block style={{ fontSize: "0.75rem" }}>
                      {errorInfo.componentStack}
                    </Code>
                  )}
                </Stack>
              </Alert>
            )}
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary for functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
  };
}
