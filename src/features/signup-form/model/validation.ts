import { t } from "@lingui/core/macro";
import { SignUpFormValues } from "./types";

export const validateSignUpForm = {
  username: (value: string) => {
    if (value.length < 3 || value.length > 50) {
      return t`Username must be between 3 and 50 characters`;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return t`Username can only contain letters, numbers, and underscores`;
    }
    return null;
  },
  email: (value: string) => {
    if (!/^\S+@\S+$/.test(value)) {
      return t`Please enter a valid email`;
    }
    return null;
  },
  password: (value: string) => {
    if (value.length < 8 || value.length > 100) {
      return t`Password must be between 8 and 100 characters`;
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return t`Password must include at least one lowercase letter`;
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return t`Password must include at least one uppercase letter`;
    }
    if (!/(?=.*\d)/.test(value)) {
      return t`Password must include at least one number`;
    }
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return t`Password must include at least one special character (@$!%*?&)`;
    }
    return null;
  },
  confirmPassword: (value: string, values: SignUpFormValues) =>
    value !== values.password ? t`Passwords do not match` : null,
  firstName: (value: string) => {
    if (value.length < 1 || value.length > 100) {
      return t`First name must be between 1 and 100 characters`;
    }
    return null;
  },
  lastName: (value: string) => {
    if (value.length < 1 || value.length > 100) {
      return t`Last name must be between 1 and 100 characters`;
    }
    return null;
  },
};

export const initialSignUpValues: SignUpFormValues = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
};
