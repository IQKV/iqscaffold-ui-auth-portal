import { Button, Group, Stack, Text } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { t } from "@lingui/core/macro";
import { type UserRegistrationResponse } from "@/shared/api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { useSignup } from "@/shared/lib/use-auth-api";
import {
  NameField,
  SignUpUsernameField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
  AuthFormCard,
  AuthLinkToLogin,
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

  const signupMutation = useSignup();

  const handleSubmit = (values: SignUpFormSchemaType) => {
    const { confirmPassword: _confirmPassword, ...signupData } = values;
    signupMutation.mutate(signupData, {
      onSuccess: (data) => {
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
    });
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
    <AuthFormCard data-testid="signup-form">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Group grow>
            <NameField name="firstName" form={form} data-testid="signup-input-firstname" />
            <NameField name="lastName" form={form} data-testid="signup-input-lastname" />
          </Group>

          <SignUpUsernameField form={form} data-testid="signup-input-username" />

          <EmailField form={form} data-testid="signup-input-email" />

          <PasswordField form={form} data-testid="signup-input-password" />

          <ConfirmPasswordField form={form} data-testid="signup-input-confirm-password" />

          <Button
            type="submit"
            fullWidth
            leftSection={<IconUserPlus size={18} />}
            loading={signupMutation.isPending}
            data-testid="signup-button-submit"
          >
            {t`Create Account`}
          </Button>

          <Text size="sm" c="dimmed" ta="center">
            {t`Want to start a new organization?`}{" "}
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() => navigate({ to: "/signup-organization" })}
            >
              {t`Create organization`}
            </Button>
          </Text>

          <AuthLinkToLogin onClick={handleNavigateToLogin} data-testid="signup-link-login" />
        </Stack>
      </form>
    </AuthFormCard>
  );
}
