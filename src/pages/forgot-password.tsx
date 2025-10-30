import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordFormFeature } from "@/features/forgot-password-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title={t`Reset Your Password`}
      subtitle={t`We'll help you get back into your account`}
    >
      <ForgotPasswordFormFeature />
    </AuthLayout>
  );
}
