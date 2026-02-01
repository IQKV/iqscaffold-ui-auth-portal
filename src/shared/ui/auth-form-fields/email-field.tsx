import { TextInput } from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface EmailFieldProps {
  form: UseFormReturnType<any>;
  /** Custom label override */
  label?: string;
  /** Custom placeholder override */
  placeholder?: string;
  /** Test ID for testing */
  "data-testid"?: string;
}

export function EmailField({
  form,
  label = t`Email`,
  placeholder = t`john.doe@example.com`,
  "data-testid": dataTestId,
}: EmailFieldProps) {
  return (
    <TextInput
      type="email"
      label={label}
      placeholder={placeholder}
      leftSection={<IconAt size={16} />}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps("email")}
    />
  );
}
