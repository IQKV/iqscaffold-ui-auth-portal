import { createFileRoute } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <AuthLayout
      title="Welcome to IQKV"
      subtitle="Sign in to your account to continue"
    >
      <SignInFormFeature useExternalRedirect />
    </AuthLayout>
  );
}
