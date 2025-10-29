/**
 * This file contains examples of how to use the enhanced error handling system
 * with RFC 7807 support and Mantine UI integration.
 *
 * These examples demonstrate best practices for different scenarios.
 */

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "@mantine/form";
import { Button, TextInput, Stack, Container } from "@mantine/core";
import { apiClient } from "./axios-config";
import {
  useErrorHandler,
  useQueryErrorHandler,
  useMutationErrorHandler,
} from "./use-error-handler";
import { useFormMutation } from "./use-form-mutation";
import { handleError } from "./error-utils";
import { ErrorBoundary } from "../ui/error-boundary";

// Example API functions
const fetchUser = async (id: string) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

const updateUser = async (data: {
  id: string;
  name: string;
  email: string;
}) => {
  const response = await apiClient.put(`/users/${data.id}`, data);
  return response.data;
};

/**
 * Example 1: Query with error handling
 */
export function UserProfileExample() {
  const { handleError } = useErrorHandler({
    showNotification: true,
    logError: true,
  });

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user", "123"],
    queryFn: () => fetchUser("123"),
    retry: (failureCount, error) => {
      // Custom retry logic based on error type
      // Note: handleError doesn't return anything, so we'll use a simpler approach
      return failureCount < 3;
    },
    retryDelay: (attemptIndex, error) => {
      // Exponential backoff with jitter
      const baseDelay = Math.min(1000 * 2 ** attemptIndex, 10000);
      return baseDelay + Math.random() * 1000;
    },
    ...useQueryErrorHandler({
      showNotification: true,
      onRetry: () => refetch(),
    }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return <div>User: {(user as any)?.name}</div>;
}

/**
 * Example 2: Form with mutation and comprehensive error handling
 */
export function UserFormExample() {
  const queryClient = useQueryClient();
  const { handleErrorWithRetry } = useErrorHandler();

  const form = useForm({
    initialValues: {
      id: "123",
      name: "",
      email: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const mutation = useFormMutation(form, updateUser, {
    notifySuccess: {
      title: "Success!",
      message: "User updated successfully",
    },
    notifyError: {
      title: "Update Failed",
      includeFieldErrorsInMessage: false, // Field errors will be shown in form
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    // Custom retry logic
    retry: (failureCount, error) => {
      const result = handleErrorWithRetry(error);
      return result.retryable && failureCount < (result.maxRetries || 3);
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    mutation.mutate(values);
  });

  return (
    <Container size="sm">
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Enter name"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            {...form.getInputProps("email")}
          />
          <Button
            type="submit"
            loading={mutation.isPending}
            disabled={!form.isValid()}
          >
            Update User
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

/**
 * Example 3: Manual error handling with modals
 */
export function ManualErrorHandlingExample() {
  const [loading, setLoading] = React.useState(false);

  const handleApiCall = async () => {
    setLoading(true);
    try {
      await apiClient.get("/api/some-endpoint");
    } catch (error) {
      // Handle error with notification
      handleError(error, {
        onRetry: handleApiCall,
        showNotification: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApiCallWithConfirmation = async () => {
    setLoading(true);
    try {
      await apiClient.post("/api/critical-operation");
    } catch (error) {
      // Handle critical operation error
      handleError(error, {
        onRetry: handleApiCallWithConfirmation,
        showNotification: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="md">
      <Button onClick={handleApiCall} loading={loading}>
        API Call with Error Modal
      </Button>
      <Button onClick={handleApiCallWithConfirmation} loading={loading}>
        Critical Operation with Confirmation
      </Button>
    </Stack>
  );
}

/**
 * Example 4: Comprehensive error handling with all features
 */
export function ComprehensiveErrorExample() {
  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const handleComplexOperation = async () => {
    try {
      await apiClient.post("/api/complex-operation");
      setRetryCount(0); // Reset on success
    } catch (error) {
      handleError(error, {
        onRetry: () => {
          setRetryCount((prev) => prev + 1);
          handleComplexOperation();
        },
        redirectToLogin: () => {
          // Custom login redirect
          window.location.href = "/login";
        },
        showNotification: true,
        maxRetries,
        currentRetry: retryCount,
      });
    }
  };

  return (
    <Button onClick={handleComplexOperation}>
      Complex Operation ({retryCount}/{maxRetries} retries)
    </Button>
  );
}

/**
 * Example 5: Error boundary usage
 */
export function ErrorBoundaryExample() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Log to external service
        console.error("Error boundary caught:", error, errorInfo);
      }}
      fallback={(error, errorInfo, retry) => (
        <Container size="sm" py="xl">
          <Stack gap="md" align="center">
            <div>Custom error fallback</div>
            <Button onClick={retry}>Try Again</Button>
          </Stack>
        </Container>
      )}
    >
      <UserProfileExample />
      <UserFormExample />
    </ErrorBoundary>
  );
}

/**
 * Example 6: Complete app setup with error handling
 */
export function AppWithErrorHandling() {
  return (
    <ErrorBoundary>
      <Container>
        <Stack gap="xl">
          <UserProfileExample />
          <UserFormExample />
          <ManualErrorHandlingExample />
          <ComprehensiveErrorExample />
        </Stack>
      </Container>
    </ErrorBoundary>
  );
}
