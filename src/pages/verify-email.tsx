import { createFileRoute } from "@tanstack/react-router";
import { EmailVerificationFormFeature } from "@/features/email-verification-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
      email: (search.email as string) || undefined,
    };
  },
});

function VerifyEmailPage() {
  return (
    <AuthLayout
      title={t`Verify Your Email`}
      subtitle={t`Complete your account setup`}
    >
      <EmailVerificationFormFeature />
    </AuthLayout>
  );
}
