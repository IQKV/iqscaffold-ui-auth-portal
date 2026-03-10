import { describe, it, expect } from "vitest";
import { resetPasswordFormSchema, initialResetPasswordValues } from "./validation";

describe("reset-password-form validation", () => {
  describe("resetPasswordFormSchema", () => {
    describe("password validation", () => {
      it("should return error for empty password", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "",
          confirmPassword: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Password must be at least 8 characters"),
            ),
          ).toBe(true);
        }
      });

      it("should return error for password less than 8 characters", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Pass1!",
          confirmPassword: "Pass1!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Password must be at least 8 characters"),
            ),
          ).toBe(true);
        }
      });

      it("should return error for password without uppercase letter", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "password123!",
          confirmPassword: "password123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.message.includes("uppercase letter")),
          ).toBe(true);
        }
      });

      it("should return error for password without lowercase letter", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "PASSWORD123!",
          confirmPassword: "PASSWORD123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.message.includes("lowercase letter")),
          ).toBe(true);
        }
      });

      it("should return error for password without number", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password!",
          confirmPassword: "Password!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues.some((issue) => issue.message.includes("number"))).toBe(true);
        }
      });

      it("should return error for password without special character", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password123",
          confirmPassword: "Password123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.message.includes("special character")),
          ).toBe(true);
        }
      });

      it("should accept valid password", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password123!",
          confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid password with different special characters", () => {
        const validPasswords = [
          "Password123@",
          "Password123$",
          "Password123!",
          "Password123%",
          "Password123*",
          "Password123?",
          "Password123&",
        ];

        validPasswords.forEach((password) => {
          const result = resetPasswordFormSchema.safeParse({
            password,
            confirmPassword: password,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("confirmPassword validation", () => {
      it("should return error for empty confirm password", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password123!",
          confirmPassword: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Please confirm your password"),
            ),
          ).toBe(true);
        }
      });

      it("should return error when passwords do not match", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password123!",
          confirmPassword: "DifferentPassword123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) => issue.message.includes("Passwords do not match")),
          ).toBe(true);
        }
      });

      it("should accept when passwords match", () => {
        const result = resetPasswordFormSchema.safeParse({
          password: "Password123!",
          confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
      });

      it("should accept when both passwords are the same complex password", () => {
        const complexPassword = "MyVerySecure123!@#";
        const result = resetPasswordFormSchema.safeParse({
          password: complexPassword,
          confirmPassword: complexPassword,
        });
        expect(result.success).toBe(true);
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
