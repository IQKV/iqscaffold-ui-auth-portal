import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface NameFieldProps {
  form: UseFormReturnType<any>;
  /** Field name in form */
  name: "firstName" | "lastName";
  /** Test ID for testing */
  "data-testid"?: string;
}

export function NameField({
  form,
  name,
  "data-testid": dataTestId,
}: NameFieldProps) {
  const isFirstName = name === "firstName";

  return (
    <TextInput
      label={isFirstName ? t`First Name` : t`Last Name`}
      placeholder={isFirstName ? t`John` : t`Doe`}
      withAsterisk
      data-testid={dataTestId}
      {...form.getInputProps(name)}
    />
  );
}
