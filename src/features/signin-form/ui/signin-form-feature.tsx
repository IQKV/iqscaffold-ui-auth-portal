import { Anchor, Button, Card, Group, Stack } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import { useAuthStore } from "@/processes/auth";
import { getAuthConfig } from "@/app/config";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import {
  SignInUsernameField,
  PasswordField,
  RememberMeCheckbox,
} from "@/shared/ui";
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
      } else {
        // Check for returnTo parameter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const returnToUrl = urlParams.get("returnTo");

        // Redirect to returnTo URL or default to app domain
        const targetUrl = returnToUrl || authConfig.redirects.afterLogin;
        window.location.href = targetUrl;
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
    <Card
      shadow="md"
      padding="xl"
      radius="md"
      withBorder
      data-testid="signin-form"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <SignInUsernameField
            form={form}
            data-testid="signin-input-username"
          />

          <PasswordField
            form={form}
            placeholder={t`Enter your password`}
            description=""
            data-testid="signin-input-password"
          />

          <Group justify="space-between">
            <RememberMeCheckbox
              form={form}
              data-testid="signin-checkbox-remember"
            />
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleForgotPassword}
              data-testid="signin-link-forgot-password"
            >
              {t`Forgot password?`}
            </Anchor>
          </Group>

          <Button
            type="submit"
            fullWidth
            loading={isLoading || loginMutation.isPending}
            data-testid="signin-button-submit"
          >
            {t`Sign In`}
          </Button>

          <Group justify="center" gap="xs">
            <Anchor
              size="sm"
              onClick={handleNavigateToRegister}
              data-testid="signin-link-register"
            >
              {t`Don't have an account? Sign up`}
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
