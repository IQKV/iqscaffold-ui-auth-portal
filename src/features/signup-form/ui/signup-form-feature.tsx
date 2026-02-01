import { Anchor, Button, Card, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconUserPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import {
  authApi,
  type UserRegistrationResponse,
  type UserRegistration,
} from "@/shared/api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import {
  NameField,
  SignUpUsernameField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
} from "@/shared/ui";
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
    <Card
      shadow="md"
      padding="xl"
      radius="md"
      withBorder
      data-testid="signup-form"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Group grow>
            <NameField
              name="firstName"
              form={form}
              data-testid="signup-input-firstname"
            />
            <NameField
              name="lastName"
              form={form}
              data-testid="signup-input-lastname"
            />
          </Group>

          <SignUpUsernameField
            form={form}
            data-testid="signup-input-username"
          />

          <EmailField form={form} data-testid="signup-input-email" />

          <PasswordField form={form} data-testid="signup-input-password" />

          <ConfirmPasswordField
            form={form}
            data-testid="signup-input-confirm-password"
          />

          <Button
            type="submit"
            fullWidth
            leftSection={<IconUserPlus size={18} />}
            loading={registerMutation.isPending}
            data-testid="signup-button-submit"
          >
            {t`Create Account`}
          </Button>

          <Group justify="center" gap="xs">
            <Anchor
              size="sm"
              onClick={handleNavigateToLogin}
              data-testid="signup-link-login"
            >
              {t`Already have an account? Sign in`}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
