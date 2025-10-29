import { ResetPasswordFormValues } from "./types";

export const validateResetPasswordForm = {
  password: (value: string) => {
    if (!value) {
      return "Password is required";
    }

    if (value.length < 8) {
      return "Password must be at least 8 characters long";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least one uppercase letter";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(value)) {
      return "Password must contain at least one lowercase letter";
    }

    // Check for at least one number
    if (!/\d/.test(value)) {
      return "Password must contain at least one number";
    }

    // Check for at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return "Password must contain at least one special character";
    }

    return null;
  },

  confirmPassword: (value: string, values: ResetPasswordFormValues) => {
    if (!value) {
      return "Please confirm your password";
    }

    if (value !== values.password) {
      return "Passwords do not match";
    }

    return null;
  },
};

export const initialResetPasswordValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};
