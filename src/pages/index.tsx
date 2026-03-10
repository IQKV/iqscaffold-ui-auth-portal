import { createFileRoute } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets";
import { t } from "@lingui/core/macro";
import { getAuthConfig } from "@/app/config";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    // Check if user is already authenticated and redirect to app domain
    const { useAuthStore } = await import("@/processes/auth");
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      const authConfig = getAuthConfig();
      window.location.href = authConfig.redirects.afterLogin;
    }
  },
  component: HomePage,
});

function HomePage() {
  return (
    <AuthLayout title={t`Welcome to IQ Scaffold`} subtitle={t`Sign in to your account to continue`}>
      <SignInFormFeature useExternalRedirect />
    </AuthLayout>
  );
}
