import { createFileRoute } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <AuthLayout
      title={t`Welcome to IQ Key Value`}
      subtitle={t`Sign in to your account to continue`}
    >
      <SignInFormFeature _useExternalRedirect />
    </AuthLayout>
  );
}
