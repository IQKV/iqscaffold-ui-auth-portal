import { createFileRoute, useSearch } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";
import { requireGuest } from "@/processes/auth";
import { Alert, Stack } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";

type LoginSearch = {
  verified?: string;
  redirect?: string;
};

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      verified: search.verified as string | undefined,
      redirect: search.redirect as string | undefined,
    };
  },
  beforeLoad: () => {
    requireGuest();
  },
  component: LoginPage,
});

function LoginPage() {
  const search = useSearch({ from: "/login" });

  return (
    <AuthLayout
      title={t`Welcome Back`}
      subtitle={t`Sign in to your account to continue`}
      pageTitle={t`Sign In`}
    >
      <Stack gap="md">
        {search.verified === "success" && (
          <Alert icon={<IconCheck size={16} />} color="green" variant="light">
            {t`Email verified successfully! You can now sign in.`}
          </Alert>
        )}
        {search.verified === "error" && (
          <Alert icon={<IconX size={16} />} color="red" variant="light">
            {t`Email verification failed. The link may be invalid or expired.`}
          </Alert>
        )}
        <SignInFormFeature _useExternalRedirect />
      </Stack>
    </AuthLayout>
  );
}
