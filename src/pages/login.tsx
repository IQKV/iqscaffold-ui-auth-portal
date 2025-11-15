import { createFileRoute } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";
import { requireGuest } from "@/processes/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    requireGuest();
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title={t`Welcome Back`}
      subtitle={t`Sign in to your account to continue`}
    >
      <SignInFormFeature useExternalRedirect />
    </AuthLayout>
  );
}
