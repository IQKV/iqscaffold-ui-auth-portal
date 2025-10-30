import { t } from "@lingui/core/macro";
import { ForgotPasswordFormValues } from "./types";

export const validateForgotPasswordForm = {
  email: (value: string) => {
    if (!value) {
      return t`Email is required`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return t`Please enter a valid email address`;
    }

    return null;
  },
};

export const initialForgotPasswordValues: ForgotPasswordFormValues = {
  email: "",
};
