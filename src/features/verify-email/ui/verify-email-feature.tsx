import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Button, Text, Alert, Stack } from "@mantine/core";
import { IconMail } from "@tabler/icons-react";
import { useVerifyEmail, useResendVerification } from "@/shared/lib/use-auth-api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { EmailField } from "@/shared/ui";
import { t } from "@lingui/core/macro";
import {
  verifyEmailFormSchema,
  initialVerifyEmailValues,
  type VerifyEmailFormSchemaType,
} from "../model/validation";

export function VerifyEmailFeature() {
  const search = useSearch({ from: "/verify-email" });
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "resend"
  >("pending");

  const form = useForm<VerifyEmailFormSchemaType>({
    initialValues: {
      ...initialVerifyEmailValues,
      email: search.email || "",
    },
    schema: verifyEmailFormSchema,
  });

  // Auto-verify if token is present in URL
  const verifyEmailMutation = useVerifyEmail();

  // Resend verification email
  const resendVerificationMutation = useResendVerification();

  useEffect(() => {
    if (search.token) {
      verifyEmailMutation.mutate(search.token, {
        onSuccess: () => {
          // Redirect to login page with success message
          navigate({ to: "/login", search: { verified: "success" } });
        },
        onError: () => {
          // Redirect to login page with error message
          navigate({ to: "/login", search: { verified: "error" } });
        },
      });
    } else if (!search.email) {
      setVerificationStatus("resend");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.token, search.email]);

  const handleResendVerification = (values: VerifyEmailFormSchemaType) => {
    resendVerificationMutation.mutate(values.email, {
      onSuccess: () => {
        setVerificationStatus("pending");
      },
    });
  };

  if (verificationStatus === "resend") {
    return (
      <form onSubmit={form.onSubmit(handleResendVerification)}>
        <Stack gap="md">
          <Alert icon={<IconMail size={16} />} color="blue" variant="light">
            <Text fw={500}>{t`Email Verification Required`}</Text>
            <Text size="sm" c="dimmed">
              {t`Please enter your email address to receive a verification link.`}
            </Text>
          </Alert>
          <EmailField
            form={form}
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            data-testid="verify-email-input-email"
          />
          <Button type="submit" loading={resendVerificationMutation.isPending} fullWidth>
            {t`Send Verification Email`}
          </Button>
          <Button
            variant="subtle"
            onClick={() => {
              navigate({ to: "/login" });
            }}
            fullWidth
          >
            {t`Back to Sign In`}
          </Button>
        </Stack>
      </form>
    );
  }

  // Pending verification - show loading state
  return (
    <Stack gap="md">
      <Alert icon={<IconMail size={16} />} color="blue" variant="light">
        <Text fw={500}>{t`Verifying Email...`}</Text>
        <Text size="sm" c="dimmed">
          {t`Please wait while we verify your email address.`}
        </Text>
      </Alert>
    </Stack>
  );
}
