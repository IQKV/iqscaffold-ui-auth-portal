import { createFileRoute } from "@tanstack/react-router";
import { SignUpFormFeature } from "@/features/signup-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      title={t`Join Your Team`}
      subtitle={t`Create your account to join an existing organization`}
      pageTitle={t`Sign Up`}
    >
      <SignUpFormFeature redirectToHome />
    </AuthLayout>
  );
}
