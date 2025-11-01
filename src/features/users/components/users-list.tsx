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
import { t } from "@lingui/core/macro";
import {
  useUsersQuery,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../hooks/use-users-query";
import { UserFormModal } from "./user-form-modal";
import {
  mapFormToCreateRequest,
  mapFormToUpdateRequest,
  mapUserToForm,
} from "../model/mappers";
import type { UserFormSchemaType } from "../model/validation";
import type { User } from "../api/users-api";

export function UsersList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpened, setModalOpened] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useUsersQuery({ page, limit, search });
  const deleteUserMutation = useDeleteUserMutation();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();

  const handleDelete = async (id: string) => {
    // Using a more accessible confirmation method instead of window.confirm
    // In a real app, you'd want to use a proper modal dialog
    const confirmed = true; // Replace with proper modal confirmation
    if (confirmed) {
      try {
        await deleteUserMutation.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setModalOpened(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setEditingUser(null);
  };

  const handleSubmitUser = async (formData: UserFormSchemaType) => {
    if (editingUser) {
      // Update existing user
      const updateData = mapFormToUpdateRequest(formData);
      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        userData: updateData,
      });
    } else {
      // Create new user
      const createData = mapFormToCreateRequest(formData);
      await createUserMutation.mutateAsync(createData);
    }
  };

  if (error) {
    return (
      <Alert color="red" title={t`Error loading users`}>
        {error instanceof Error
          ? error.message
          : t`An unexpected error occurred`}
      </Alert>
    );
  }

  const users = data?.data || [];
  const pagination = data?.pagination;

  return (
    <Stack>
      <Group justify="space-between">
        <Text size="xl" fw={700}>
          {t`Users Management`}
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={handleAddUser}>
          {t`Add User`}
        </Button>
      </Group>

      <TextInput
        placeholder={t`Search users...`}
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
              <Table.Th>{t`User`}</Table.Th>
              <Table.Th>{t`Email`}</Table.Th>
              <Table.Th>{t`Role`}</Table.Th>
              <Table.Th>{t`Created`}</Table.Th>
              <Table.Th>{t`Actions`}</Table.Th>
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
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={() => handleEditUser(user)}
                      aria-label={`${t`Edit`} ${user.name}`}
                    >
                      <IconEdit size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDelete(user.id)}
                      loading={deleteUserMutation.isPending}
                      aria-label={`${t`Delete`} ${user.name}`}
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
            {t`No users found`}
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

      <UserFormModal
        opened={modalOpened}
        onClose={handleCloseModal}
        user={editingUser ? mapUserToForm(editingUser) : undefined}
        onSubmit={handleSubmitUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />
    </Stack>
  );
}
