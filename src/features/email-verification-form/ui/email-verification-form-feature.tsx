import { Anchor, Button, Card, Group, Stack, Text, Alert } from "@mantine/core";
import {
  IconMail,
  IconArrowLeft,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { t } from "@lingui/core/macro";
import { useForm, UseFormInput } from "@/shared/lib/enhanced-form-hook";
import {
  useVerifyEmail,
  useResendVerification,
} from "@/shared/lib/use-auth-api";
import { FormField } from "@/shared/ui";
import {
  emailVerificationFormSchema,
  initialEmailVerificationValues,
  type EmailVerificationFormSchemaType,
} from "../model/validation";
import { EmailVerificationFormValues } from "../model/types";

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

  const form = useForm({
    initialValues: {
      ...initialEmailVerificationValues,
      email: email || "",
    },
    schema: emailVerificationFormSchema,
  } as UseFormInput<EmailVerificationFormSchemaType>);

  // Use custom hooks for email verification
  const verifyEmailMutation = useVerifyEmail();
  const resendVerificationMutation = useResendVerification();

  // Handle verification success
  useEffect(() => {
    if (verifyEmailMutation.isSuccess) {
      setVerificationStatus("success");
      if (onVerificationSuccess) {
        onVerificationSuccess();
      } else {
        // Navigate to login after successful verification
        setTimeout(() => {
          navigate({ to: "/login" });
        }, 2000);
      }
    }
  }, [verifyEmailMutation.isSuccess, onVerificationSuccess, navigate]);

  // Handle verification error
  useEffect(() => {
    if (verifyEmailMutation.isError) {
      setVerificationStatus("error");
    }
  }, [verifyEmailMutation.isError]);

  // Handle resend success
  useEffect(() => {
    if (resendVerificationMutation.isSuccess && onResendSuccess) {
      const emailValue = form.values.email;
      onResendSuccess(emailValue);
    }
  }, [
    resendVerificationMutation.isSuccess,
    onResendSuccess,
    form.values.email,
  ]);

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
    resendVerificationMutation.mutate(values.email);
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
      <form onSubmit={form.onSubmit(handleResendSubmit)} noValidate>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            {t`Enter your email address and we'll send you a new verification link.`}
          </Text>

          <FormField
            type="email"
            name="email"
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            leftSection={<IconMail size={16} />}
            required
            form={form}
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
