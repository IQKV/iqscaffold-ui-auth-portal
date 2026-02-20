import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Container,
  Stack,
  Text,
  Title,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import { useInvitationPreview } from "@/shared/lib/use-invitation-api";
import {
  OrganizationPreview,
  SignupWithInvitationForm,
  InvitationExpired,
  InvitationInvalid,
} from "@/features/signup-with-invitation";
import type { SignupWithInvitationResponse } from "@/shared/api/invitation-api";

export const Route = createFileRoute("/join/$invitationCode")({
  component: JoinWithInvitationPage,
});

function JoinWithInvitationPage() {
  const { invitationCode } = Route.useParams();
  const navigate = useNavigate();

  const {
    data: organization,
    isLoading,
    error,
  } = useInvitationPreview(invitationCode);

  const handleSignupSuccess = (data: SignupWithInvitationResponse) => {
    // Store tokens in localStorage
    localStorage.setItem("accessToken", data.tokens.accessToken);
    localStorage.setItem("refreshToken", data.tokens.refreshToken);

    // Redirect to app.iqscaffold.com dashboard
    window.location.href = `${import.meta.env.VITE_APP_PORTAL_URL || "https://app.iqscaffold.com"}/dashboard`;
  };

  if (isLoading) {
    return (
      <Container size="sm" py="xl">
        <LoadingOverlay visible />
      </Container>
    );
  }

  // Handle different error states
  if (error) {
    const errorMessage = (error as any)?.message || "";
    const statusCode = (error as any)?.status;

    // 410 Gone - Expired invitation
    if (statusCode === 410 || errorMessage.includes("expired")) {
      return (
        <Container size="sm" py="xl">
          <InvitationExpired />
        </Container>
      );
    }

    // 404 Not Found or other errors - Invalid invitation
    return (
      <Container size="sm" py="xl">
        <InvitationInvalid />
      </Container>
    );
  }

  if (!organization) {
    return (
      <Container size="sm" py="xl">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title={t`Error`}
          color="red"
        >
          {t`Unable to load invitation details`}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} ta="center" mb="xs">
            {t`Join Organization`}
          </Title>
          <Text size="sm" c="dimmed" ta="center">
            {t`Complete the form below to join the organization`}
          </Text>
        </div>

        <OrganizationPreview organization={organization} />

        <SignupWithInvitationForm
          invitationCode={invitationCode}
          onSuccess={handleSignupSuccess}
        />
      </Stack>
    </Container>
  );
}
