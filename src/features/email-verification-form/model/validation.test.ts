import { describe, it, expect } from "vitest";
import {
  validateEmailVerificationForm,
  initialEmailVerificationValues,
} from "./validation";

describe("email-verification-form validation", () => {
  describe("validateEmailVerificationForm", () => {
    describe("email validation", () => {
      it("should return error for empty email", () => {
        const result = validateEmailVerificationForm.email("");
        expect(result).toBe("Email is required");
      });

      it("should return error for invalid email format", () => {
        const result = validateEmailVerificationForm.email("invalid-email");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return error for email without domain", () => {
        const result = validateEmailVerificationForm.email("test@");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return error for email without @", () => {
        const result = validateEmailVerificationForm.email("testexample.com");
        expect(result).toBe("Please enter a valid email address");
      });

      it("should return null for valid email", () => {
        const result = validateEmailVerificationForm.email("test@example.com");
        expect(result).toBeNull();
      });

      it("should return null for valid email with subdomain", () => {
        const result = validateEmailVerificationForm.email(
          "user@mail.example.com"
        );
        expect(result).toBeNull();
      });

      it("should return null for valid email with numbers", () => {
        const result = validateEmailVerificationForm.email(
          "user123@example123.com"
        );
        expect(result).toBeNull();
      });
    });
  });

  describe("initialEmailVerificationValues", () => {
    it("should have correct initial values", () => {
      expect(initialEmailVerificationValues).toEqual({
        email: "",
      });
    });

    it("should have empty email by default", () => {
      expect(initialEmailVerificationValues.email).toBe("");
    });
  });
});
