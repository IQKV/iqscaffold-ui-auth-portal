import { PasswordInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface PasswordFieldProps {
  form: UseFormReturnType<any>;
  /** Field name in form */
  name?: string;
  /** Custom label override */
  label?: string;
  /** Custom placeholder override */
  placeholder?: string;
  /** Custom description */
  description?: string;
  /** Show password strength indicator */
  _showStrengthIndicator?: boolean;
  /** Test ID for testing */
  "data-testid"?: string;
}

export function PasswordField({
  form,
  name = "password",
  label = t`Password`,
  placeholder = t`Create a strong password`,
  description = t`Min 8 characters with uppercase, lowercase, number, and special character`,
  _showStrengthIndicator = false,
  "data-testid": dataTestId,
}: PasswordFieldProps) {
  return (
    <PasswordInput
      label={label}
      placeholder={placeholder}
      description={description}
      leftSection={<IconLock size={16} />}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps(name)}
    />
  );
}
