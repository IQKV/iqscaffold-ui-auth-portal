import { Button, Group, Stack, TextInput } from "@mantine/core";
import { IconUserPlus } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { useSignupWithInvitation } from "@/shared/lib/use-invitation-api";
import {
  NameField,
  EmailField,
  PasswordField,
  ConfirmPasswordField,
  AuthFormCard,
} from "@/shared/ui";
import { z } from "zod";
import type { SignupWithInvitationResponse } from "@/shared/api/invitation-api";

// Validation schema for signup with invitation
const signupWithInvitationSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters")
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        "Username can only contain letters, numbers, underscores, and hyphens"
      ),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
    confirmPassword: z.string(),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(100, "First name must be at most 100 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(100, "Last name must be at most 100 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupWithInvitationFormValues = z.infer<
  typeof signupWithInvitationSchema
>;

interface SignupWithInvitationFormProps {
  invitationCode: string;
  onSuccess: (data: SignupWithInvitationResponse) => void;
}

export function SignupWithInvitationForm({
  invitationCode,
  onSuccess,
}: SignupWithInvitationFormProps) {
  const form = useForm<SignupWithInvitationFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    schema: signupWithInvitationSchema,
  });

  const signupMutation = useSignupWithInvitation(invitationCode);

  const handleSubmit = (values: SignupWithInvitationFormValues) => {
    const { confirmPassword, ...signupData } = values;
    signupMutation.mutate(signupData, {
      onSuccess: (data) => {
        onSuccess(data);
      },
    });
  };

  return (
    <AuthFormCard data-testid="signup-with-invitation-form">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          <Group grow>
            <NameField
              name="firstName"
              form={form}
              data-testid="signup-input-firstname"
            />
            <NameField
              name="lastName"
              form={form}
              data-testid="signup-input-lastname"
            />
          </Group>

          <TextInput
            label={t`Username`}
            placeholder={t`Enter username`}
            required
            {...form.getInputProps("username")}
            data-testid="signup-input-username"
          />

          <EmailField form={form} data-testid="signup-input-email" />

          <PasswordField form={form} data-testid="signup-input-password" />

          <ConfirmPasswordField
            form={form}
            data-testid="signup-input-confirm-password"
          />

          <Button
            type="submit"
            fullWidth
            leftSection={<IconUserPlus size={18} />}
            loading={signupMutation.isPending}
            data-testid="signup-button-submit"
          >
            {t`Join Organization`}
          </Button>
        </Stack>
      </form>
    </AuthFormCard>
  );
}
