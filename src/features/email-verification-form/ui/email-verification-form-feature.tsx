import {
  Anchor,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconMail,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { t } from "@lingui/core/macro";
import { authApi } from "@/shared/api";
import {
  initialEmailVerificationValues,
  validateEmailVerificationForm,
} from "../model/validation";
import type { EmailVerificationFormValues } from "../model/types";

interface EmailVerificationFormFeatureProps {
  token?: string;
  email?: string;
  onVerificationSuccess?: () => void;
  onResendSuccess?: (email: string) => void;
  onBackToLogin?: () => void;
}

export function EmailVerificationFormFeature({
  token: propToken,
  email: propEmail,
  onVerificationSuccess,
  onResendSuccess,
  onBackToLogin,
}: EmailVerificationFormFeatureProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/verify-email" }) as {
    token?: string;
    email?: string;
  };

  // Get token and email from props or URL search params
  const token = propToken || search.token;
  const email = propEmail || search.email;

  const [verificationStatus, setVerificationStatus] = useState<
    "success" | "error" | null
  >(null);

  const form = useForm<EmailVerificationFormValues>({
    initialValues: {
      ...initialEmailVerificationValues,
      email: email || "",
    },
    validate: validateEmailVerificationForm,
  });

  // Auto-verify if token is provided
  const verifyEmailMutation = useMutation({
    mutationFn: async (verificationToken: string) => {
      return await authApi.verifyEmail(verificationToken);
    },
    onSuccess: () => {
      setVerificationStatus("success");
      notifications.show({
        title: t`Email Verified Successfully`,
        message: t`Your email has been verified. You can now sign in to your account.`,
        color: "green",
        icon: <IconCheck size={16} />,
      });

      if (onVerificationSuccess) {
        onVerificationSuccess();
      } else {
        // Navigate to login after successful verification
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 2000);
      }
    },
    onError: (error: any) => {
      setVerificationStatus("error");
      const errorMessage =
        error?.message ||
        t`Failed to verify email. The verification link may be invalid or expired.`;

      notifications.show({
        title: t`Verification Failed`,
        message: errorMessage,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    },
  });

  // Resend verification email
  const resendVerificationMutation = useMutation({
    mutationFn: async (values: EmailVerificationFormValues) => {
      return await authApi.resendVerification(values.email);
    },
    onSuccess: (_, variables) => {
      notifications.show({
        title: t`Verification Email Sent`,
        message: t`We've sent a new verification email to ${variables.email}. Please check your inbox and click the verification link.`,
        color: "green",
        icon: <IconCheck size={16} />,
      });

      if (onResendSuccess) {
        onResendSuccess(variables.email);
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message ||
        t`Failed to send verification email. Please try again.`;

      notifications.show({
        title: t`Send Failed`,
        message: errorMessage,
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    },
  });

  // Auto-verify when component mounts if token is provided
  useEffect(() => {
    if (
      token &&
      verificationStatus === null &&
      !verifyEmailMutation.isPending &&
      !verifyEmailMutation.isSuccess &&
      !verifyEmailMutation.isError
    ) {
      verifyEmailMutation.mutate(token);
    }
  }, [token, verificationStatus, verifyEmailMutation]);

  const handleResendSubmit = (values: EmailVerificationFormValues) => {
    resendVerificationMutation.mutate(values);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate({ to: "/login" });
    }
  };

  // Show verification result if we have a token
  if (token) {
    return (
      <Card shadow="md" padding="xl" radius="md" withBorder>
        <Stack gap="md" align="center">
          {verifyEmailMutation.isPending && (
            <>
              <Text size="lg" fw={500}>
                {t`Verifying Your Email...`}
              </Text>
              <Text size="sm" c="dimmed" ta="center">
                {t`Please wait while we verify your email address.`}
              </Text>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <Alert
                icon={<IconCheck size={16} />}
                title={t`Email Verified!`}
                color="green"
                variant="light"
              >
                {t`Your email has been successfully verified. You will be redirected to the login page shortly.`}
              </Alert>
              <Button onClick={handleBackToLogin} variant="light">
                {t`Continue to Sign In`}
              </Button>
            </>
          )}

          {verificationStatus === "error" && (
            <>
              <Alert
                icon={<IconAlertCircle size={16} />}
                title={t`Verification Failed`}
                color="red"
                variant="light"
              >
                {t`The verification link is invalid or has expired. You can request a new verification email below.`}
              </Alert>
              <Button onClick={handleBackToLogin} variant="light">
                {t`Back to Sign In`}
              </Button>
            </>
          )}
        </Stack>
      </Card>
    );
  }

  // Show resend verification form if no token
  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleResendSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            {t`Enter your email address and we'll send you a new verification link.`}
          </Text>

          <TextInput
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            leftSection={<IconMail size={16} />}
            required
            {...form.getInputProps("email")}
          />

          <Button
            type="submit"
            fullWidth
            loading={resendVerificationMutation.isPending}
          >
            {t`Send Verification Email`}
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
                {t`Back to Sign In`}
              </Group>
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
