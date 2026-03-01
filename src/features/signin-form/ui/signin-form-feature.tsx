import { Button, Group, Stack, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { useFormMutation } from "@/shared/lib/use-form-mutation";
import { t } from "@lingui/core/macro";
import { useAuthStore } from "@/processes/auth";
import { useTenantStore } from "@/processes/tenant";
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
import { TenantSelect } from "@/widgets";
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
  const setTenantId = useTenantStore((state) => state.setTenantId);

  const form = useForm<SignInFormSchemaType>({
    initialValues: initialSignInValues,
    schema: signInFormSchema,
  });

  const loginMutation = useFormMutation(
    form,
    async (values: SignInFormSchemaType) => {
      // Set tenant ID before login to ensure it's in the request header
      setTenantId(values.tenantId);
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
          <TenantSelect
            value={form.values.tenantId}
            onChange={(value) =>
              form.setFieldValue("tenantId", value || "default")
            }
            error={form.errors.tenantId}
            required
            data-testid="signin-select-tenant"
          />

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
        </Stack>
      </form>
    </AuthFormCard>
  );
}
