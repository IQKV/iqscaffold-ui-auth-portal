import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordFormFeature } from "@/features/forgot-password-form";
import { AuthLayout } from "@/widgets/auth-layout";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="We'll help you get back into your account"
    >
      <ForgotPasswordFormFeature />
    </AuthLayout>
  );
}
