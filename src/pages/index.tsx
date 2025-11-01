import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignInFormFeature } from "@/features/signin-form";
import { AuthLayout } from "@/widgets";
import { t } from "@lingui/core/macro";
import { useIsAuthenticated } from "@/processes/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    // Check if user is already authenticated
    const { useAuthStore } = await import("@/processes/auth");
    const { isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
  component: HomePage,
});

function HomePage() {
  return (
    <AuthLayout
      title={t`Welcome to IQKV`}
      subtitle={t`Sign in to your account to continue`}
    >
      <SignInFormFeature />
    </AuthLayout>
  );
}
