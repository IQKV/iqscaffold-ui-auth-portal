import { useEffect, useState } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { Button, Text, Alert, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconX, IconMail } from "@tabler/icons-react";
import {
  useVerifyEmail,
  useResendVerification,
} from "@/shared/lib/use-auth-api";
import { t } from "@lingui/core/macro";
import type { VerifyEmailFormValues } from "../model/types";

export function VerifyEmailFeature() {
  const search = useSearch({ from: "/verify-email" });
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "resend"
  >("pending");

  const form = useForm<VerifyEmailFormValues>({
    initialValues: {
      email: search.email || "",
    },
    validate: {
      email: (value) => {
        if (!value) {
          return t`Email is required`;
        }
        if (!/^\S+@\S+\.\S+$/.test(value)) {
          return t`Invalid email format`;
        }
        return null;
      },
    },
  });

  // Auto-verify if token is present in URL
  const verifyEmailMutation = useVerifyEmail();

  // Resend verification email
  const resendVerificationMutation = useResendVerification();

  useEffect(() => {
    if (search.token) {
      verifyEmailMutation.mutate(search.token, {
        onSuccess: () => {
          setVerificationStatus("success");
          setTimeout(() => {
            navigate({ to: "/login" });
          }, 3000);
        },
        onError: () => {
          setVerificationStatus("error");
        },
      });
    } else if (!search.email) {
      setVerificationStatus("resend");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.token, search.email]);

  const handleResendVerification = (values: VerifyEmailFormValues) => {
    if (values.email) {
      resendVerificationMutation.mutate(values.email, {
        onSuccess: () => {
          setVerificationStatus("pending");
        },
      });
    }
  };

  if (verificationStatus === "success") {
    return (
      <Stack gap="md">
        <Alert icon={<IconCheck size={16} />} color="green" variant="light">
          <Text fw={500}>{t`Email Successfully Verified`}</Text>
          <Text size="sm" c="dimmed">
            {t`Your email address has been verified. Redirecting to login...`}
          </Text>
        </Alert>
        <Button
          variant="light"
          onClick={() => {
            navigate({ to: "/login" });
          }}
          fullWidth
        >
          {t`Continue to Sign In`}
        </Button>
      </Stack>
    );
  }

  if (verificationStatus === "error") {
    return (
      <Stack gap="md">
        <Alert icon={<IconX size={16} />} color="red" variant="light">
          <Text fw={500}>{t`Verification Failed`}</Text>
          <Text size="sm" c="dimmed">
            {t`The verification link is invalid or has expired. You can request a new verification email below.`}
          </Text>
        </Alert>
        <form onSubmit={form.onSubmit(handleResendVerification)}>
          <Stack gap="md">
            <TextInput
              label={t`Email Address`}
              placeholder={t`Enter your email address`}
              leftSection={<IconMail size={16} />}
              {...form.getInputProps("email")}
              required
            />
            <Button
              type="submit"
              loading={resendVerificationMutation.isPending}
              fullWidth
            >
              {t`Resend Verification Email`}
            </Button>
          </Stack>
        </form>
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
    );
  }

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
          <TextInput
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            leftSection={<IconMail size={16} />}
            {...form.getInputProps("email")}
            required
          />
          <Button
            type="submit"
            loading={resendVerificationMutation.isPending}
            fullWidth
          >
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

  // Pending verification
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
