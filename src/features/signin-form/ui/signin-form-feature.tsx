import { Button, Group, Stack } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useFormMutation } from "@/shared/lib/use-form-mutation";
import { t } from "@lingui/core/macro";
import { useAuthStore } from "@/processes/auth";
import { getAuthConfig } from "@/app/config";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import {
  SignInUsernameField,
  PasswordField,
  RememberMeCheckbox,
  AuthFormCard,
  AuthLinkToRegister,
  AuthLinkToForgotPassword,
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

  const loginMutation = useFormMutation(
    form,
    async (values: SignInFormSchemaType) => {
      await login(values);
    },
    {
      notifySuccess: {
        title: t`Login Successful`,
        message: t`Welcome back!`,
      },
      notifyError: {
        title: t`Login Failed`,
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
    }
  );

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
    <AuthFormCard data-testid="signin-form">
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
            <AuthLinkToForgotPassword
              onClick={handleForgotPassword}
              data-testid="signin-link-forgot-password"
            />
          </Group>

          <Button
            type="submit"
            fullWidth
            loading={isLoading || loginMutation.isPending}
            data-testid="signin-button-submit"
          >
            {t`Sign In`}
          </Button>

          <AuthLinkToRegister
            onClick={handleNavigateToRegister}
            data-testid="signin-link-register"
          />
        </Stack>
      </form>
    </AuthFormCard>
  );
}
