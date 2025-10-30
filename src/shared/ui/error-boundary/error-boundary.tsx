import { Alert, Button, Container, Stack, Title } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";
import { Component, ErrorInfo, ReactNode } from "react";
import { t } from "@lingui/core/macro";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="lg">
            <Title order={2}>{t`Something went wrong`}</Title>

            <Alert
              icon={<IconAlertCircle size="1rem" />}
              title={t`Application Error`}
              color="red"
              variant="light"
            >
              {this.state.error?.message || t`An unexpected error occurred`}
            </Alert>

            <Button
              leftSection={<IconRefresh size="1rem" />}
              onClick={() => window.location.reload()}
            >
              {t`Reload Page`}
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}
