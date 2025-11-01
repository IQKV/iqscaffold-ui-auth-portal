import { Modal, Title } from "@mantine/core";
import { t } from "@lingui/core/macro";
import { UserForm } from "./user-form";
import { type UserFormSchemaType } from "../model/validation";

interface UserFormModalProps {
  opened: boolean;
  onClose: () => void;
  user?: Partial<UserFormSchemaType> & { id?: string };
  onSubmit: (values: UserFormSchemaType) => Promise<void>;
  isLoading?: boolean;
}

export function UserFormModal({
  opened,
  onClose,
  user,
  onSubmit,
  isLoading,
}: UserFormModalProps) {
  const isEditing = Boolean(user?.id);

  const handleSubmit = async (values: UserFormSchemaType) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>{isEditing ? t`Edit User` : t`Create New User`}</Title>
      }
      size="md"
      centered
    >
      <UserForm
        user={user}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isLoading={isLoading}
      />
    </Modal>
  );
}
