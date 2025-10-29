import { ForgotPasswordFormValues } from "./types";

export const validateForgotPasswordForm = {
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

export const initialForgotPasswordValues: ForgotPasswordFormValues = {
  email: "",
};
