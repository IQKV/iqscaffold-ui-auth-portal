import { Anchor, Button, Card, Group, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconLock, IconUser } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import { authApi, type TokenResponse } from "@/shared/api";
import { getAuthConfig } from "@/app/config";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import {
  signInFormSchema,
  initialSignInValues,
  type SignInFormSchemaType,
} from "../model/validation";

interface SignInFormFeatureProps {
  onSuccess?: (data: TokenResponse) => void;
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

  const form = useForm<SignInFormSchemaType>({
    initialValues: initialSignInValues,
    schema: signInFormSchema,
  });

  const loginMutation = useMutation({
    mutationFn: async (values: SignInFormSchemaType) => {
      return await authApi.login(values);
    },
    onSuccess: (data) => {
      // Store tokens in localStorage
      localStorage.setItem(
        authConfig.tokenStorage.accessTokenKey,
        data.accessToken
      );
      localStorage.setItem(
        authConfig.tokenStorage.refreshTokenKey,
        data.refreshToken
      );

      const firstName = data.user.firstName;
      notifications.show({
        title: t`Login Successful`,
        message: t`Welcome back, ${firstName}!`,
        color: "green",
      });

      if (onSuccess) {
        onSuccess(data);
      } else if (useExternalRedirect) {
        // External redirect to app domain
        window.location.href = authConfig.redirects.afterLogin;
      } else {
        // Internal navigation
        navigate({ to: "/" });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || t`Invalid credentials. Please try again.`;

      notifications.show({
        title: t`Login Failed`,
        message: errorMessage,
        color: "red",
      });
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
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

          <Button type="submit" fullWidth loading={loginMutation.isPending}>
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
