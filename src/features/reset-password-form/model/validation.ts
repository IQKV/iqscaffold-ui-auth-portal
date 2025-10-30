import { t } from "@lingui/core/macro";
import { ResetPasswordFormValues } from "./types";

export const validateResetPasswordForm = {
  password: (value: string) => {
    if (!value) {
      return t`Password is required`;
    }

    if (value.length < 8) {
      return t`Password must be at least 8 characters long`;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      return t`Password must contain at least one uppercase letter`;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      return t`Password must contain at least one lowercase letter`;
    }

    // Check for at least one number
    if (!/\d/.test(value)) {
      return t`Password must contain at least one number`;
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return t`Password must contain at least one special character`;
    }

    return null;
  },

  confirmPassword: (value: string, values: ResetPasswordFormValues) => {
    if (!value) {
      return t`Please confirm your password`;
    }

    if (value !== values.password) {
      return t`Passwords do not match`;
    }

    return null;
  },
};

export const initialResetPasswordValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};
