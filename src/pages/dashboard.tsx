import { createFileRoute } from "@tanstack/react-router";
import { Container, Title, Text, Card, Group, Button } from "@mantine/core";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import {
  useCurrentUser,
  useAuthStore,
  useUserFullName,
  formatUserDisplayName,
  requireAuth,
} from "@/processes/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    requireAuth();
  },
  component: DashboardPage,
});

function DashboardPage() {
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const userFullName = useUserFullName();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null; // This shouldn't happen due to requireAuth guard
  }

  return (
    <Container size="md" py="xl">
      <Title order={1} mb="xl">
        {t`Dashboard`}
      </Title>

      <Card shadow="sm" padding="lg" radius="md" withBorder mb="md">
        <Group justify="space-between" mb="xs">
          <Text fw={500} size="lg">
            {t`Welcome, ${userFullName}!`}
          </Text>
          <IconUser size={24} />
        </Group>

        <Text size="sm" c="dimmed" mb="md">
          {t`You are successfully authenticated and can access protected content.`}
        </Text>

        <Group gap="xs" mb="md">
          <Text size="sm" fw={500}>
            {t`Email:`}
          </Text>
          <Text size="sm">{user.email}</Text>
        </Group>

        <Group gap="xs" mb="md">
          <Text size="sm" fw={500}>
            {t`Roles:`}
          </Text>
          <Text size="sm">{user.roles.join(", ")}</Text>
        </Group>

        <Group gap="xs" mb="md">
          <Text size="sm" fw={500}>
            {t`Tenant:`}
          </Text>
          <Text size="sm">{user.tenantId}</Text>
        </Group>

        <Button
          leftSection={<IconLogout size={16} />}
          variant="light"
          color="red"
          onClick={handleLogout}
          mt="md"
        >
          {t`Logout`}
        </Button>
      </Card>
    </Container>
  );
}
