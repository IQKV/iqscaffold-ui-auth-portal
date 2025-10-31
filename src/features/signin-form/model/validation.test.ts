import { describe, it, expect } from "vitest";
import { signInFormSchema, initialSignInValues } from "./validation";

describe("signin-form validation", () => {
  describe("signInFormSchema", () => {
    describe("username validation", () => {
      it("should return error for empty username", () => {
        const result = signInFormSchema.safeParse({
          username: "",
          password: "password",
          rememberMe: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Username or email must be at least 3 characters"
              )
            )
          ).toBe(true);
        }
      });

      it("should return error for username with less than 3 characters", () => {
        const result = signInFormSchema.safeParse({
          username: "ab",
          password: "password",
          rememberMe: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Username or email must be at least 3 characters"
              )
            )
          ).toBe(true);
        }
      });

      it("should accept valid username", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "password",
          rememberMe: false,
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid email", () => {
        const result = signInFormSchema.safeParse({
          username: "test@example.com",
          password: "password",
          rememberMe: false,
        });
        expect(result.success).toBe(true);
      });
    });

    describe("password validation", () => {
      it("should return error for empty password", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "",
          rememberMe: false,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Password is required")
            )
          ).toBe(true);
        }
      });

      it("should accept any non-empty password", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "p",
          rememberMe: false,
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid password", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "password123",
          rememberMe: false,
        });
        expect(result.success).toBe(true);
      });
    });

    describe("rememberMe validation", () => {
      it("should accept rememberMe as true", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "password",
          rememberMe: true,
        });
        expect(result.success).toBe(true);
      });

      it("should default rememberMe to false when not provided", () => {
        const result = signInFormSchema.safeParse({
          username: "user",
          password: "password",
        });
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.rememberMe).toBe(false);
        }
      });
    });
  });

  describe("initialSignInValues", () => {
    it("should have correct initial values", () => {
      expect(initialSignInValues).toEqual({
        username: "",
        password: "",
        rememberMe: false,
      });
    });

    it("should have rememberMe as false by default", () => {
      expect(initialSignInValues.rememberMe).toBe(false);
    });
  });
});
