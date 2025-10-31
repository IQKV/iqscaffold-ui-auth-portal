import {
  Anchor,
  Button,
  Card,
  Group,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAt, IconLock, IconUser, IconUserPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import { authApi, type UserRegistrationResponse } from "@/shared/api";
import type { UserRegistration } from "@/entities/user";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import {
  signUpFormSchema,
  initialSignUpValues,
  type SignUpFormSchemaType,
} from "../model/validation";

interface SignUpFormFeatureProps {
  onSuccess?: (data: UserRegistrationResponse) => void;
  onNavigateToLogin?: () => void;
  redirectToHome?: boolean;
}

export function SignUpFormFeature({
  onSuccess,
  onNavigateToLogin,
  redirectToHome = false,
}: SignUpFormFeatureProps) {
  const navigate = useNavigate();

  const form = useForm<SignUpFormSchemaType>({
    initialValues: initialSignUpValues,
    schema: signUpFormSchema,
  });

  const registerMutation = useMutation({
    mutationFn: async (values: UserRegistration) => {
      return await authApi.signup(values);
    },
    onSuccess: (data) => {
      notifications.show({
        title: t`Registration Successful`,
        message:
          data.message ||
          t`Your account has been created. Please verify your email.`,
        color: "green",
      });

      if (onSuccess) {
        onSuccess(data);
      } else if (redirectToHome) {
        // Redirect back to auth homepage (login page)
        navigate({ to: "/" });
      } else {
        // Default behavior: navigate to login
        navigate({ to: "/login" });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || t`Registration failed. Please try again.`;

      notifications.show({
        title: t`Registration Failed`,
        message: errorMessage,
        color: "red",
      });
    },
  });

  const handleSubmit = (values: SignUpFormSchemaType) => {
    const { confirmPassword, ...signupData } = values;
    registerMutation.mutate(signupData);
  };

  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else if (redirectToHome) {
      // Redirect back to homepage (which is the login page)
      navigate({ to: "/" });
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Group grow>
            <TextInput
              label={t`First Name`}
              placeholder={t`John`}
              required
              {...form.getInputProps("firstName")}
            />
            <TextInput
              label={t`Last Name`}
              placeholder={t`Doe`}
              required
              {...form.getInputProps("lastName")}
            />
          </Group>

          <TextInput
            label={t`Username`}
            placeholder={t`johndoe`}
            leftSection={<IconUser size={16} />}
            description={t`3-50 characters, letters, numbers, and underscores only`}
            required
            {...form.getInputProps("username")}
          />

          <TextInput
            label={t`Email`}
            placeholder={t`john.doe@example.com`}
            leftSection={<IconAt size={16} />}
            type="email"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label={t`Password`}
            placeholder={t`Create a strong password`}
            leftSection={<IconLock size={16} />}
            description={t`Min 8 characters with uppercase, lowercase, number, and special character`}
            required
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label={t`Confirm Password`}
            placeholder={t`Re-enter your password`}
            leftSection={<IconLock size={16} />}
            required
            {...form.getInputProps("confirmPassword")}
          />

          <Button
            type="submit"
            fullWidth
            leftSection={<IconUserPlus size={18} />}
            loading={registerMutation.isPending}
          >
            {t`Create Account`}
          </Button>

          <Group justify="center" gap="xs">
            <Anchor size="sm" onClick={handleNavigateToLogin}>
              {t`Already have an account? Sign in`}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
