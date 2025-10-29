import { describe, it, expect } from "vitest";
import {
  validateResetPasswordForm,
  initialResetPasswordValues,
} from "./validation";
import type { ResetPasswordFormValues } from "./types";

describe("reset-password-form validation", () => {
  describe("validateResetPasswordForm", () => {
    describe("password validation", () => {
      it("should return error for empty password", () => {
        const result = validateResetPasswordForm.password("");
        expect(result).toBe("Password is required");
      });

      it("should return error for password less than 8 characters", () => {
        const result = validateResetPasswordForm.password("Pass1!");
        expect(result).toBe("Password must be at least 8 characters long");
      });

      it("should return error for password without uppercase letter", () => {
        const result = validateResetPasswordForm.password("password123!");
        expect(result).toBe(
          "Password must contain at least one uppercase letter"
        );
      });

      it("should return error for password without lowercase letter", () => {
        const result = validateResetPasswordForm.password("PASSWORD123!");
        expect(result).toBe(
          "Password must contain at least one lowercase letter"
        );
      });

      it("should return error for password without number", () => {
        const result = validateResetPasswordForm.password("Password!");
        expect(result).toBe("Password must contain at least one number");
      });

      it("should return error for password without special character", () => {
        const result = validateResetPasswordForm.password("Password123");
        expect(result).toBe(
          "Password must contain at least one special character"
        );
      });

      it("should return null for valid password", () => {
        const result = validateResetPasswordForm.password("Password123!");
        expect(result).toBeNull();
      });

      it("should return null for valid password with different special characters", () => {
        const validPasswords = [
          "Password123@",
          "Password123#",
          "Password123$",
          "Password123%",
          "Password123^",
          "Password123&",
          "Password123*",
        ];

        validPasswords.forEach((password) => {
          const result = validateResetPasswordForm.password(password);
          expect(result).toBeNull();
        });
      });
    });

    describe("confirmPassword validation", () => {
      const mockValues: ResetPasswordFormValues = {
        password: "Password123!",
        confirmPassword: "",
      };

      it("should return error for empty confirm password", () => {
        const result = validateResetPasswordForm.confirmPassword(
          "",
          mockValues
        );
        expect(result).toBe("Please confirm your password");
      });

      it("should return error when passwords do not match", () => {
        const result = validateResetPasswordForm.confirmPassword(
          "DifferentPassword123!",
          mockValues
        );
        expect(result).toBe("Passwords do not match");
      });

      it("should return null when passwords match", () => {
        const result = validateResetPasswordForm.confirmPassword(
          "Password123!",
          mockValues
        );
        expect(result).toBeNull();
      });

      it("should return null when both passwords are the same complex password", () => {
        const complexPassword = "MyVerySecure123!@#";
        const values: ResetPasswordFormValues = {
          password: complexPassword,
          confirmPassword: complexPassword,
        };

        const result = validateResetPasswordForm.confirmPassword(
          complexPassword,
          values
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("initialResetPasswordValues", () => {
    it("should have correct initial values", () => {
      expect(initialResetPasswordValues).toEqual({
        password: "",
        confirmPassword: "",
      });
    });

    it("should have empty password by default", () => {
      expect(initialResetPasswordValues.password).toBe("");
    });

    it("should have empty confirmPassword by default", () => {
      expect(initialResetPasswordValues.confirmPassword).toBe("");
    });
  });
});
