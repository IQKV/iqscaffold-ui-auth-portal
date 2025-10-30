import { createFileRoute } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title={t`Welcome Back`}
      subtitle={t`Sign in to your account to continue`}
    >
      <SignInFormFeature />
    </AuthLayout>
  );
}
