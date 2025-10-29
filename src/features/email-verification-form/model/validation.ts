import { EmailVerificationFormValues } from "./types";

export const validateEmailVerificationForm = {
  email: (value: string) => {
    if (!value) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }

    return null;
  },
};

export const initialEmailVerificationValues: EmailVerificationFormValues = {
  email: "",
};
