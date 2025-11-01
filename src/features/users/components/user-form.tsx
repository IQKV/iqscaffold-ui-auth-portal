import { Button, Group, Select, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconAt,
  IconUser,
  IconUserPlus,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import {
  userFormSchema,
  initialUserValues,
  createInitialUserValues,
  type UserFormSchemaType,
} from "../model/validation";

interface UserFormProps {
  user?: Partial<UserFormSchemaType> & { id?: string };
  onSubmit: (values: UserFormSchemaType) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  onCancel,
  isLoading,
}: UserFormProps) {
  const isEditing = Boolean(user?.id);

  const form = useForm<UserFormSchemaType>({
    initialValues: user ? createInitialUserValues(user) : initialUserValues,
    schema: userFormSchema,
  });

  const handleSubmit = async (values: UserFormSchemaType) => {
    try {
      await onSubmit(values);

      notifications.show({
        title: isEditing ? t`User Updated` : t`User Created`,
        message: isEditing
          ? t`User has been successfully updated.`
          : t`User has been successfully created.`,
        color: "green",
      });

      if (!isEditing) {
        form.reset();
      }
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        (isEditing
          ? t`Failed to update user. Please try again.`
          : t`Failed to create user. Please try again.`);

      notifications.show({
        title: isEditing ? t`Update Failed` : t`Creation Failed`,
        message: errorMessage,
        color: "red",
      });
    }
  };

  const roleOptions = [
    { value: "user", label: t`User` },
    { value: "admin", label: t`Admin` },
  ];

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        <Group grow>
          <FormField
            type="text"
            name="firstName"
            label={t`First Name`}
            placeholder={t`John`}
            leftSection={<IconUser size={16} />}
            required
            form={form}
          />
          <FormField
            type="text"
            name="lastName"
            label={t`Last Name`}
            placeholder={t`Doe`}
            leftSection={<IconUser size={16} />}
            required
            form={form}
          />
        </Group>

        <FormField
          type="text"
          name="username"
          label={t`Username`}
          placeholder={t`johndoe`}
          leftSection={<IconUser size={16} />}
          description={t`3-50 characters, letters, numbers, and underscores only`}
          required
          form={form}
        />

        <FormField
          type="email"
          name="email"
          label={t`Email`}
          placeholder={t`john.doe@example.com`}
          leftSection={<IconAt size={16} />}
          required
          form={form}
        />

        <Select
          label={t`Role`}
          placeholder={t`Select user role`}
          data={roleOptions}
          required
          {...form.getInputProps("role")}
        />

        <Group justify="flex-end" mt="md">
          {onCancel && (
            <Button variant="light" onClick={onCancel} disabled={isLoading}>
              {t`Cancel`}
            </Button>
          )}
          <Button
            type="submit"
            leftSection={
              isEditing ? (
                <IconDeviceFloppy size={18} />
              ) : (
                <IconUserPlus size={18} />
              )
            }
            loading={isLoading}
          >
            {isEditing ? t`Update User` : t`Create User`}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
