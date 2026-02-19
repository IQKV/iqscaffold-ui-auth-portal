import { createFileRoute } from "@tanstack/react-router";
import { OrganizationSignUpFormFeature } from "@/features/organization-signup-form";
import { AuthLayout } from "@/widgets/auth-layout";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/signup-organization")({
  component: OrganizationSignupPage,
});

function OrganizationSignupPage() {
  return (
    <AuthLayout
      title={t`Start Your Organization`}
      subtitle={t`Create your tenant environment and invite your team`}
      pageTitle={t`Organization Signup`}
    >
      <OrganizationSignUpFormFeature />
    </AuthLayout>
  );
}
