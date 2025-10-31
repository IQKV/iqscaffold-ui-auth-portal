import { describe, it, expect } from "vitest";
import {
  emailVerificationFormSchema,
  initialEmailVerificationValues,
} from "./validation";

describe("email-verification-form validation", () => {
  describe("emailVerificationFormSchema", () => {
    describe("email validation", () => {
      it("should return error for empty email", () => {
        const result = emailVerificationFormSchema.safeParse({ email: "" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe("Email is required");
        }
      });

      it("should return error for invalid email format", () => {
        const result = emailVerificationFormSchema.safeParse({
          email: "invalid-email",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toBe(
            "Please enter a valid email address"
          );
        }
      });

      it("should accept valid email", () => {
        const result = emailVerificationFormSchema.safeParse({
          email: "test@example.com",
        });
        expect(result.success).toBe(true);
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
