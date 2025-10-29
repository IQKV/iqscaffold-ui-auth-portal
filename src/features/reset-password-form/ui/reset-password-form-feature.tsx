import {
  Anchor,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconLock, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/shared/api";
import {
  initialResetPasswordValues,
  validateResetPasswordForm,
} from "../model/validation";
import type { ResetPasswordFormValues } from "../model/types";

interface ResetPasswordFormFeatureProps {
  token?: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ResetPasswordFormFeature({
  token: propToken,
  onSuccess,
  onBackToLogin,
}: ResetPasswordFormFeatureProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" }) as { token?: string };

  // Get token from props or URL search params
  const token = propToken || search.token;

  const form = useForm<ResetPasswordFormValues>({
    initialValues: initialResetPasswordValues,
    validate: {
      password: validateResetPasswordForm.password,
      confirmPassword: (value, values) =>
        validateResetPasswordForm.confirmPassword(value, values),
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (values: ResetPasswordFormValues) => {
      if (!token) {
        throw new Error("Reset token is missing");
      }
      return await authApi.resetPassword(token, values.password);
    },
    onSuccess: () => {
      notifications.show({
        title: "Password Reset Successful",
        message:
          "Your password has been successfully reset. You can now sign in with your new password.",
        color: "green",
      });

      if (onSuccess) {
        onSuccess();
      } else {
        // Navigate to login after successful reset
        navigate({ to: "/login" });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message ||
        "Failed to reset password. Please try again or request a new reset link.";

      notifications.show({
        title: "Reset Failed",
        message: errorMessage,
        color: "red",
      });
    },
  });

  const handleSubmit = (values: ResetPasswordFormValues) => {
    resetPasswordMutation.mutate(values);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate({ to: "/login" });
    }
  };

  // Show error if no token is provided
  if (!token) {
    return (
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Text size="lg" fw={500} c="red">
            Invalid Reset Link
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            This password reset link is invalid or has expired. Please request a
            new password reset.
          </Text>
          <Button onClick={handleBackToLogin} variant="light">
            Back to Sign In
          </Button>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            Enter your new password below. Make sure it's strong and secure.
          </Text>

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            type="submit"
            fullWidth
            loading={resetPasswordMutation.isPending}
          >
            Reset Password
          </Button>

          <Group justify="center" gap="xs">
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleBackToLogin}
            >
              <Group gap="xs" align="center">
                <IconArrowLeft size={14} />
                Back to Sign In
              </Group>
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
