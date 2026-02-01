import { TextInput } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface BaseUsernameFieldProps {
  form: UseFormReturnType<any>;
  /** Test ID for testing */
  "data-testid"?: string;
}

// For sign-in form - accepts username or email
export function SignInUsernameField({
  form,
  "data-testid": dataTestId,
}: BaseUsernameFieldProps) {
  return (
    <TextInput
      label={t`Username or Email`}
      placeholder={t`Enter your username or email`}
      leftSection={<IconUser size={16} />}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps("username")}
    />
  );
}

// For sign-up form - username only with description
export function SignUpUsernameField({
  form,
  "data-testid": dataTestId,
}: BaseUsernameFieldProps) {
  return (
    <TextInput
      label={t`Username`}
      placeholder={t`johndoe`}
      leftSection={<IconUser size={16} />}
      description={t`3-50 characters, letters, numbers, and underscores only`}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps("username")}
    />
  );
}
