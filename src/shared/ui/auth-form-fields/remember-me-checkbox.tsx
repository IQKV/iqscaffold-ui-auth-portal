import { Checkbox } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { t } from "@lingui/core/macro";

interface RememberMeCheckboxProps {
  form: UseFormReturnType<any>;
  /** Test ID for testing */
  "data-testid"?: string;
}

export function RememberMeCheckbox({ form, "data-testid": dataTestId }: RememberMeCheckboxProps) {
  return (
    <Checkbox
      label={t`Remember me`}
      data-testid={dataTestId}
      {...form.getInputProps("rememberMe", { type: "checkbox" })}
    />
  );
}
