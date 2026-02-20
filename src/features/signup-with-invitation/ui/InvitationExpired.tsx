import { Paper, Stack, Text, ThemeIcon, Button } from "@mantine/core";
import { IconClockX } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import { useNavigate } from "@tanstack/react-router";

export function InvitationExpired() {
  const navigate = useNavigate();

  return (
    <Paper p="xl" withBorder shadow="sm" data-testid="invitation-expired">
      <Stack gap="md" align="center">
        <ThemeIcon size={64} variant="light" color="yellow">
          <IconClockX size={32} />
        </ThemeIcon>

        <Text size="xl" fw={600} ta="center">
          {t`Invitation Expired`}
        </Text>

        <Text size="sm" c="dimmed" ta="center">
          {t`This invitation has expired and can no longer be used.`}
        </Text>

        <Text size="sm" ta="center">
          {t`Please contact the organization administrator to request a new invitation.`}
        </Text>

        <Button onClick={() => navigate({ to: "/" })} mt="md">
          {t`Go to Login`}
        </Button>
      </Stack>
    </Paper>
  );
}
