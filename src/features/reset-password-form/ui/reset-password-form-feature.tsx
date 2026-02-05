import {
  //   Anchor, // Removed
  Button,
  //   Card, // Removed
  //   Group, // Removed
  Stack,
  Text,
  Loader,
  Center,
} from "@mantine/core";
// import { IconArrowLeft } from "@tabler/icons-react"; // Removed
import { useNavigate, useSearch } from "@tanstack/react-router";
// import { useEffect } from "react"; // Removed
import { t } from "@lingui/core/macro";
import {
  //   useResetPassword, // Removed
  useValidateResetToken,
} from "@/shared/lib/use-auth-api";
import { authApi } from "@/shared/api";
import { useFormMutation } from "@/shared/lib/use-form-mutation";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import {
  PasswordField,
  ConfirmPasswordField,
  AuthFormCard,
  AuthLinkBackToLogin,
} from "@/shared/ui";
import {
  resetPasswordFormSchema,
  initialResetPasswordValues,
  type ResetPasswordFormSchemaType,
} from "../model/validation";

interface ResetPasswordFormFeatureProps {
  token?: string;
  onSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ResetPasswordFormFeature({
  token: propToken,
  onSuccess,
  onBackToLogin,
}: ResetPasswordFormFeatureProps) {
  const navigate = useNavigate();
  const search = useSearch({ from: "/reset-password" }) as { token?: string };

  // Get token from props or URL search params
  const token = propToken || search.token;

  // Validate the reset token
  const { data: isTokenValid, isLoading: isValidating } =
    useValidateResetToken(token);

  const form = useForm<ResetPasswordFormSchemaType>({
    initialValues: initialResetPasswordValues,
    schema: resetPasswordFormSchema,
  });

  const resetPasswordMutation = useFormMutation(
    form,
    async (values: ResetPasswordFormSchemaType) => {
      // The type check is actually handled by mutator function, but we double check or cast if needed
      // Actually values doesn't contain token.
      if (!token) {
        throw new Error("Token missing");
      }
      return await authApi.resetPassword(token, values.password);
    },
    {
      notifySuccess: {
        title: t`Password Reset Successful`,
        message: t`Your password has been successfully reset`,
      },
      notifyError: {
        title: t`Password Reset Failed`,
      },
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to login after successful reset
          navigate({ to: "/login" });
        }
      },
    }
  );

  const handleSubmit = (values: ResetPasswordFormSchemaType) => {
    if (!token) {
      return;
    }
    resetPasswordMutation.mutate(values);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate({ to: "/login" });
    }
  };

  // Show loading state while validating token
  if (isValidating) {
    return (
      <AuthFormCard data-testid="reset-password-loading">
        <Center py="xl">
          <Stack gap="md" align="center">
            <Loader size="lg" />
            <Text size="sm" c="dimmed">
              {t`Validating reset link...`}
            </Text>
          </Stack>
        </Center>
      </AuthFormCard>
    );
  }

  // Show error if no token is provided or token is invalid
  if (!token || isTokenValid === false) {
    return (
      <AuthFormCard data-testid="reset-password-invalid">
        <Stack gap="md" align="center">
          <Text size="lg" fw={500} c="red">
            {t`Invalid Reset Link`}
          </Text>
          <Text size="sm" c="dimmed" ta="center">
            {t`This password reset link is invalid or has expired. Please request a new password reset.`}
          </Text>
          <Button
            onClick={handleBackToLogin}
            variant="light"
            data-testid="reset-password-button-back-invalid"
          >
            {t`Back to Sign In`}
          </Button>
        </Stack>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard data-testid="reset-password-form">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            {t`Enter your new password below. Make sure it's strong and secure.`}
          </Text>

          <PasswordField
            form={form}
            label={t`New Password`}
            placeholder={t`Enter your new password`}
            description=""
            data-testid="reset-password-input-password"
          />

          <ConfirmPasswordField
            form={form}
            name="confirmPassword"
            data-testid="reset-password-input-confirm-password"
          />

          <Button
            type="submit"
            fullWidth
            loading={resetPasswordMutation.isPending}
            data-testid="reset-password-button-submit"
          >
            {t`Reset Password`}
          </Button>

          <AuthLinkBackToLogin
            onClick={handleBackToLogin}
            data-testid="reset-password-link-back"
          />
        </Stack>
      </form>
    </AuthFormCard>
  );
}
