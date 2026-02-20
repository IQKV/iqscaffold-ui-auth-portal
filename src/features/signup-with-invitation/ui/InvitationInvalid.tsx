import { Paper, Stack, Text, ThemeIcon, Button } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import { useNavigate } from "@tanstack/react-router";

export function InvitationInvalid() {
  const navigate = useNavigate();

  return (
    <Paper p="xl" withBorder shadow="sm" data-testid="invitation-invalid">
      <Stack gap="md" align="center">
        <ThemeIcon size={64} variant="light" color="red">
          <IconAlertCircle size={32} />
        </ThemeIcon>

        <Text size="xl" fw={600} ta="center">
          {t`Invalid Invitation`}
        </Text>

        <Text size="sm" c="dimmed" ta="center">
          {t`This invitation link is invalid or has been revoked.`}
        </Text>

        <Text size="sm" ta="center">
          {t`Please check the invitation link or contact the organization administrator for assistance.`}
        </Text>

        <Button onClick={() => navigate({ to: "/" })} mt="md">
          {t`Go to Login`}
        </Button>
      </Stack>
    </Paper>
  );
}
