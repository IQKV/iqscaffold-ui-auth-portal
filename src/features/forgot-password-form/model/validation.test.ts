import { describe, it, expect } from "vitest";
import {
  validateForgotPasswordForm,
  initialForgotPasswordValues,
} from "./validation";

describe("forgot-password-form validation", () => {
  describe("validateForgotPasswordForm", () => {
    describe("email validation", () => {
      it("should return error for empty email", () => {
        const result = validateForgotPasswordForm.email("");
        expect(result).toBe("Email is required");
      });

      it("should return error for invalid email format", () => {
        const result = validateForgotPasswordForm.email("invalid-email");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return error for email without domain", () => {
        const result = validateForgotPasswordForm.email("test@");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return error for email without @", () => {
        const result = validateForgotPasswordForm.email("testexample.com");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return null for valid email", () => {
        const result = validateForgotPasswordForm.email("test@example.com");
        expect(result).toBeNull();
      });

      it("should return null for valid email with subdomain", () => {
        const result = validateForgotPasswordForm.email(
          "user@mail.example.com"
        );
        expect(result).toBeNull();
      });

      it("should return null for valid email with numbers", () => {
        const result = validateForgotPasswordForm.email(
          "user123@example123.com"
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("initialForgotPasswordValues", () => {
    it("should have correct initial values", () => {
      expect(initialForgotPasswordValues).toEqual({
        email: "",
      });
    });

    it("should have empty email by default", () => {
      expect(initialForgotPasswordValues.email).toBe("");
    });
  });
});
