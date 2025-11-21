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
      title={t`Create Your Account`}
      subtitle={t`Join IQKV and start your journey`}
      pageTitle={t`Sign Up`}
    >
      <SignUpFormFeature redirectToHome />
    </AuthLayout>
  );
}
