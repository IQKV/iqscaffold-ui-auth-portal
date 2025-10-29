import { createFileRoute } from "@tanstack/react-router";
import { EmailVerificationFormFeature } from "@/features/email-verification-form";
import { AuthLayout } from "@/widgets/auth-layout";

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
      title="Verify Your Email"
      subtitle="Complete your account setup"
    >
      <EmailVerificationFormFeature />
    </AuthLayout>
  );
}
