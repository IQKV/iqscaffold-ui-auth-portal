import { createFileRoute, Link } from "@tanstack/react-router";
import { Container, Title, Text, Button, Stack } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";

export const Route = createFileRoute("/unauthorized")({
  component: UnauthorizedPage,
});

function UnauthorizedPage() {
  return (
    <Container size="sm" py="xl">
      <Stack align="center" gap="lg">
        <Title order={1} c="red">
          {t`Access Denied`}
        </Title>

        <Text size="lg" ta="center" c="dimmed">
          {t`You don't have permission to access this page.`}
        </Text>

        <Text ta="center">
          {t`Please contact your administrator if you believe this is an error.`}
        </Text>

        <Button
          component={Link}
          to="/"
          leftSection={<IconArrowLeft size={16} />}
          variant="light"
        >
          {t`Go Back Home`}
        </Button>
      </Stack>
    </Container>
  );
}
