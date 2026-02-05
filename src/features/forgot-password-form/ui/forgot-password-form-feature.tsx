import { Button, Stack, Text } from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { t } from "@lingui/core/macro";
import { authApi } from "@/shared/api";
import { useFormMutation } from "@/shared/lib/use-form-mutation";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { EmailField, AuthFormCard, AuthLinkBackToLogin } from "@/shared/ui";
import {
  forgotPasswordFormSchema,
  initialForgotPasswordValues,
  type ForgotPasswordFormSchemaType,
} from "../model/validation";

interface ForgotPasswordFormFeatureProps {
  onSuccess?: (email: string) => void;
  onBackToLogin?: () => void;
}

export function ForgotPasswordFormFeature({
  onSuccess,
  onBackToLogin,
}: ForgotPasswordFormFeatureProps) {
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormSchemaType>({
    initialValues: initialForgotPasswordValues,
    schema: forgotPasswordFormSchema,
  });

  const forgotPasswordMutation = useFormMutation(
    form,
    async (email: string) => {
      return await authApi.forgotPassword(email);
    },
    {
      notifySuccess: {
        title: t`Reset Link Sent`,
        message: t`Please check your email for the password reset link`,
      },
      notifyError: {
        title: t`Failed to Send Reset Link`,
      },
      onSuccess: () => {
        const email = form.values.email;
        if (onSuccess) {
          onSuccess(email);
        } else {
          // Navigate back to login after successful submission
          navigate({ to: "/login" });
        }
      },
    }
  );

  const handleSubmit = (values: ForgotPasswordFormSchemaType) => {
    forgotPasswordMutation.mutate(values.email);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <AuthFormCard data-testid="forgot-password-form">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            {t`Enter your email address and we'll send you a link to reset your password.`}
          </Text>

          <EmailField
            form={form}
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            data-testid="forgot-password-input-email"
          />

          <Button
            type="submit"
            fullWidth
            loading={forgotPasswordMutation.isPending}
            data-testid="forgot-password-button-submit"
          >
            {t`Send Reset Link`}
          </Button>

          <AuthLinkBackToLogin
            onClick={handleBackToLogin}
            data-testid="forgot-password-link-back"
          />
        </Stack>
      </form>
    </AuthFormCard>
  );
}
