import {
  Anchor,
  Button,
  Card,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconMail, IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { t } from "@lingui/core/macro";
import { authApi } from "@/shared/api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
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

  const forgotPasswordMutation = useMutation({
    mutationFn: async (values: ForgotPasswordFormSchemaType) => {
      return await authApi.forgotPassword(values.email);
    },
    onSuccess: (_, variables) => {
      const email = variables.email;
      notifications.show({
        title: t`Reset Link Sent`,
        message: t`We've sent a password reset link to ${email}. Please check your email and follow the instructions.`,
        color: "green",
      });

      if (onSuccess) {
        onSuccess(variables.email);
      } else {
        // Navigate back to login after successful submission
        navigate({ to: "/login" });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || t`Failed to send reset email. Please try again.`;

      notifications.show({
        title: t`Reset Failed`,
        message: errorMessage,
        color: "red",
      });
    },
  });

  const handleSubmit = (values: ForgotPasswordFormSchemaType) => {
    forgotPasswordMutation.mutate(values);
  };

  const handleBackToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate({ to: "/login" });
    }
  };

  return (
    <Card shadow="md" padding="xl" radius="md" withBorder>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text size="sm" c="dimmed" ta="center">
            {t`Enter your email address and we'll send you a link to reset your password.`}
          </Text>

          <TextInput
            label={t`Email Address`}
            placeholder={t`Enter your email address`}
            leftSection={<IconMail size={16} />}
            required
            {...form.getInputProps("email")}
          />

          <Button
            type="submit"
            fullWidth
            loading={forgotPasswordMutation.isPending}
          >
            {t`Send Reset Link`}
          </Button>

          <Group justify="center" gap="xs">
            <Anchor
              component="button"
              type="button"
              size="sm"
              onClick={handleBackToLogin}
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
