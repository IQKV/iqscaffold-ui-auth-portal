import { PasswordInput } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface ConfirmPasswordFieldProps {
  form: UseFormReturnType<any>;
  /** Field name in form */
  name?: string;
  /** Custom label override */
  label?: string;
  /** Custom placeholder override */
  placeholder?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ConfirmPasswordField({
  form,
  name = "confirmPassword",
  label = t`Confirm Password`,
  placeholder = t`Confirm your password`,
  "data-testid": dataTestId,
}: ConfirmPasswordFieldProps) {
  return (
    <PasswordInput
      label={label}
      placeholder={placeholder}
      leftSection={<IconLock size={16} />}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps(name)}
    />
  );
}
