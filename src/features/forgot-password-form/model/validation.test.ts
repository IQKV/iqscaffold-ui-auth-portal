import { describe, it, expect } from "vitest";
import { forgotPasswordFormSchema, initialForgotPasswordValues } from "./validation";

describe("forgot-password-form validation", () => {
  describe("forgotPasswordFormSchema", () => {
    describe("email validation", () => {
      it("should return error for empty email", () => {
        const result = forgotPasswordFormSchema.safeParse({ email: "" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Email is required");
        }
      });

      it("should return error for invalid email format", () => {
        const result = forgotPasswordFormSchema.safeParse({
          email: "invalid-email",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Please enter a valid email address");
        }
      });

      it("should return error for email without domain", () => {
        const result = forgotPasswordFormSchema.safeParse({ email: "test@" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Please enter a valid email address");
        }
      });

      it("should return error for email without @", () => {
        const result = forgotPasswordFormSchema.safeParse({
          email: "testexample.com",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Please enter a valid email address");
        }
      });

      it("should accept valid email", () => {
        const result = forgotPasswordFormSchema.safeParse({
          email: "test@example.com",
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid email with subdomain", () => {
        const result = forgotPasswordFormSchema.safeParse({
          email: "user@mail.example.com",
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid email with numbers", () => {
        const result = forgotPasswordFormSchema.safeParse({
          email: "user123@example123.com",
        });
        expect(result.success).toBe(true);
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
