import { Container, Title } from "@mantine/core";
import { t } from "@lingui/core/macro";
import { UsersList } from "./users-list";

export function UsersPage() {
  return (
    <Container size="xl" py="md">
      <Title order={1} mb="lg">
        {t`Users`}
      </Title>
      <UsersList />
    </Container>
  );
}
