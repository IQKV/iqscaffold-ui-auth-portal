import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordFormFeature } from "@/features/reset-password-form";
import { AuthLayout } from "@/widgets/auth-layout";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: (search.token as string) || undefined,
    };
  },
});

function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Create a strong password for your account"
    >
      <ResetPasswordFormFeature />
    </AuthLayout>
  );
}
