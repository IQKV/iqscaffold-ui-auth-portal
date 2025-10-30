import { t } from "@lingui/core/macro";
import { EmailVerificationFormValues } from "./types";

export const validateEmailVerificationForm = {
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

export const initialEmailVerificationValues: EmailVerificationFormValues = {
  email: "",
};
