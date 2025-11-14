/**
 * Backward compatibility wrapper for FormField
 * Maps old API to new enhanced FormField API
 */

import {
  FormField as EnhancedFormField,
  type FormFieldProps as EnhancedFormFieldProps,
} from "./form-field";

// Re-export all types from enhanced form field
export type { EnhancedFormFieldProps as FormFieldProps };

// Create a compatibility wrapper that maps old props to new props
export function FormField(props: any) {
  const { required, leftSection, ...rest } = props;

  // Map old props to new props
  const enhancedProps: any = {
    ...rest,
    withAsterisk: required || rest.withAsterisk,
  };

  // For password fields, enable strength indicator if it's a new password field
  if (
    props.type === "password" &&
    (props.name === "newPassword" || props.name === "password")
  ) {
    enhancedProps.showStrengthIndicator = true;
  }

  return <EnhancedFormField {...enhancedProps} />;
}

// Export as both FormField and EnhancedFormField for backward compatibility
export { FormField as EnhancedFormField };
