import { useState } from "react";
import {
  Table,
  Group,
  Text,
  ActionIcon,
  Avatar,
  Badge,
  TextInput,
  Button,
  Stack,
  Pagination,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { IconSearch, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useUsersQuery, useDeleteUserMutation } from "../hooks/use-users-query";

export function UsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading, error } = useUsersQuery({ page, limit, search });
  const deleteUserMutation = useDeleteUserMutation();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  if (error) {
    return (
      <Alert color="red" title="Error loading users">
        {error instanceof Error
          ? error.message
          : "An unexpected error occurred"}
      </Alert>
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={700}>
          Users Management
        </Text>
        <Button leftSection={<IconPlus size={16} />}>Add User</Button>
      </Group>

      <TextInput
        placeholder="Search users..."
        leftSection={<IconSearch size={16} />}
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        style={{ maxWidth: 400 }}
      />

      <div style={{ position: "relative" }}>
        <LoadingOverlay visible={isLoading} />

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {users.map((user) => (
              <Table.Tr key={user.id}>
                <Table.Td>
                  <Group gap="sm">
                    <Avatar src={user.avatar} size={40} radius={40} />
                    <div>
                      <Text fz="sm" fw={500}>
                        {user.name}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">{user.email}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge
                    color={user.role === "admin" ? "red" : "blue"}
                    variant="light"
                  >
                    {user.role}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Text fz="sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Group gap={0} justify="flex-end">
                    <ActionIcon variant="subtle" color="gray">
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(user.id)}
                      loading={deleteUserMutation.isPending}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {users.length === 0 && !isLoading && (
          <Text ta="center" py="xl" c="dimmed">
            No users found
          </Text>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={page}
            onChange={setPage}
            total={pagination.totalPages}
          />
        </Group>
      )}
    </Stack>
  );
}
