import { Anchor, Button, Card, Group, Stack, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { t } from "@lingui/core/macro";
import { useForgotPassword } from "@/shared/lib/use-auth-api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { EmailField } from "@/shared/ui";
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

  // Use custom hook for forgot password
  const forgotPasswordMutation = useForgotPassword();

  // Handle success
  useEffect(() => {
    if (forgotPasswordMutation.isSuccess) {
      const email = form.values.email;
      if (onSuccess) {
        onSuccess(email);
      } else {
        // Navigate back to login after successful submission
        navigate({ to: "/login" });
      }
    }
  }, [
    forgotPasswordMutation.isSuccess,
    onSuccess,
    navigate,
    form.values.email,
  ]);

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
    <Card
      shadow="md"
      padding="xl"
      radius="md"
      withBorder
      data-testid="forgot-password-form"
    >
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

          <Group justify="center" gap="xs">
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleBackToLogin}
              data-testid="forgot-password-link-back"
            >
              <Group gap="xs" align="center">
                <IconArrowLeft size={14} />
                {t`Back to Sign In`}
              </Group>
            </Anchor>
          </Group>
        </Stack>
      </form>
    </Card>
  );
}
