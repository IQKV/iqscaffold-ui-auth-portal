import { Anchor, Button, Card, Group, Stack } from "@mantine/core";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import { useAuthStore } from "@/processes/auth";
import { getAuthConfig } from "@/app/config";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import {
  signInFormSchema,
  initialSignInValues,
  type SignInFormSchemaType,
} from "../model/validation";

interface SignInFormFeatureProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onNavigateToRegister?: () => void;
  useExternalRedirect?: boolean;
}

export function SignInFormFeature({
  onSuccess,
  onForgotPassword,
  onNavigateToRegister,
  useExternalRedirect = false,
}: SignInFormFeatureProps) {
  const navigate = useNavigate();
  const authConfig = getAuthConfig();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const form = useForm<SignInFormSchemaType>({
    initialValues: initialSignInValues,
    schema: signInFormSchema,
  });

  const loginMutation = useMutation({
    mutationFn: async (values: SignInFormSchemaType) => {
      await login(values);
    },
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      } else if (useExternalRedirect) {
        // External redirect to app domain
        window.location.href = authConfig.redirects.afterLogin;
      } else {
        // Internal navigation
        navigate({ to: "/dashboard" });
      }
    },
    onError: (error: any) => {
      // Error handling is now done in the auth store
      console.error("Login error:", error);
    },
  });

  const handleSubmit = (values: SignInFormSchemaType) => {
    loginMutation.mutate(values);
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    } else {
      navigate({ to: "/forgot-password" });
    }
  };

  const handleNavigateToRegister = () => {
    if (onNavigateToRegister) {
      onNavigateToRegister();
    } else {
      navigate({ to: "/register" });
    }
  };

  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <FormField
            type="text"
            name="username"
            label={t`Username or Email`}
            placeholder={t`Enter your username or email`}
            leftSection={<IconUser size={16} />}
            required
            form={form}
          />

          <FormField
            type="password"
            name="password"
            label={t`Password`}
            placeholder={t`Enter your password`}
            leftSection={<IconLock size={16} />}
            required
            form={form}
          />

          <Group justify="space-between">
            <FormField
              type="checkbox"
              name="rememberMe"
              label={t`Remember me`}
              form={form}
            />
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleForgotPassword}
            >
              {t`Forgot password?`}
            </Anchor>
          </Group>

          <Button
            type="submit"
            fullWidth
            loading={isLoading || loginMutation.isPending}
          >
            {t`Sign In`}
          </Button>

          <Group justify="center" gap="xs">
            <Anchor size="sm" onClick={handleNavigateToRegister}>
              {t`Don't have an account? Sign up`}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
