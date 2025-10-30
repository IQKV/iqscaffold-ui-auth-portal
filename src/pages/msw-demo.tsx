import {
  Container,
  Title,
  Text,
  Stack,
  Card,
  Group,
  Badge,
} from "@mantine/core";
import { createFileRoute } from "@tanstack/react-router";
import { t } from "@lingui/core/macro";
import { UsersList } from "@/features/users/components/users-list";
import { useMSWControl } from "@/shared/lib";

export const Route = createFileRoute("/msw-demo")({
  component: MSWDemoPage,
});

export function MSWDemoPage() {
  const { config, isRunning } = useMSWControl();

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="md">
            {t`MSW Demo Page`}
          </Title>
          <Text c="dimmed" size="lg">
            {t`This page demonstrates Mock Service Worker (MSW) functionality. The users list below uses mocked API responses when MSW is enabled.`}
          </Text>
        </div>

        <Card withBorder padding="md">
          <Group justify="space-between" mb="md">
            <Text fw={500}>{t`MSW Status`}</Text>
            <Badge color={isRunning ? "green" : "gray"}>
              {isRunning ? t`Active` : t`Inactive`}
            </Badge>
          </Group>

          <Stack gap="xs">
            <Group>
              <Text size="sm" c="dimmed">
                {t`Enabled:`}
              </Text>
              <Text size="sm">{config.enabled ? t`Yes` : t`No`}</Text>
            </Group>
            <Group>
              <Text size="sm" c="dimmed">
                {t`Logging:`}
              </Text>
              <Text size="sm">{config.enableLogging ? t`Yes` : t`No`}</Text>
            </Group>
            <Group>
              <Text size="sm" c="dimmed">
                {t`Unhandled Requests:`}
              </Text>
              <Text size="sm">{config.onUnhandledRequest}</Text>
            </Group>
            <Group>
              <Text size="sm" c="dimmed">
                {t`Delay:`}
              </Text>
              <Text size="sm">
                {config.delay
                  ? typeof config.delay === "object"
                    ? `${config.delay.min}-${config.delay.max}ms`
                    : `${config.delay}ms`
                  : t`None`}
              </Text>
            </Group>
          </Stack>
        </Card>

        <Card withBorder padding="md">
          <Title order={2} mb="md">
            {t`Users Management Demo`}
          </Title>
          <Text c="dimmed" mb="md">
            {t`This component fetches data from /api/v1/users. When MSW is enabled, it returns mock data. When disabled, it will attempt to call your real API.`}
          </Text>

          <UsersList />
        </Card>

        <Card withBorder padding="md">
          <Title order={3} mb="md">
            {t`How to Use MSW`}
          </Title>
          <Stack gap="md">
            <div>
              <Text fw={500} mb="xs">
                {t`1. Environment Configuration`}
              </Text>
              <Text size="sm" c="dimmed">
                {t`Set VITE_ENABLE_MSW=true in your .env file`}
              </Text>
            </div>

            <div>
              <Text fw={500} mb="xs">
                {t`2. Development Tools`}
              </Text>
              <Text size="sm" c="dimmed">
                {t`Use the floating MSW Dev Tools panel (bottom-right) to control MSW at runtime`}
              </Text>
            </div>

            <div>
              <Text fw={500} mb="xs">
                {t`3. Add New Mocks`}
              </Text>
              <Text size="sm" c="dimmed">
                {t`Create handlers in src/shared/mocks/handlers/ and export them`}
              </Text>
            </div>

            <div>
              <Text fw={500} mb="xs">
                {t`4. Testing`}
              </Text>
              <Text size="sm" c="dimmed">
                {t`MSW automatically works in tests - no additional setup required`}
              </Text>
            </div>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
