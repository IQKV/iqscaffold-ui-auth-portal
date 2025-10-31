import { describe, it, expect } from "vitest";
import { signUpFormSchema, initialSignUpValues } from "./validation";

describe("signup-form validation", () => {
  describe("signUpFormSchema", () => {
    const validFormData = {
      username: "testuser",
      email: "test@example.com",
      firstName: "Test",
      lastName: "User",
      password: "Password123!",
      confirmPassword: "Password123!",
    };

    describe("username validation", () => {
      it("should return error for username shorter than 3 characters", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "ab",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Username must be at least 3 characters")
            )
          ).toBe(true);
        }
      });

      it("should return error for username longer than 50 characters", () => {
        const longUsername = "a".repeat(51);
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: longUsername,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Username must be less than 50 characters")
            )
          ).toBe(true);
        }
      });

      it("should return error for username with special characters", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "user@name",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Username can only contain letters, numbers, and underscores"
              )
            )
          ).toBe(true);
        }
      });

      it("should return error for username with spaces", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "user name",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Username can only contain letters, numbers, and underscores"
              )
            )
          ).toBe(true);
        }
      });

      it("should accept valid username with letters", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "username",
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid username with numbers", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "user123",
        });
        expect(result.success).toBe(true);
      });

      it("should accept valid username with underscores", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          username: "user_name",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("email validation", () => {
      it("should return error for invalid email without @", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          email: "invalidemail",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Please enter a valid email address")
            )
          ).toBe(true);
        }
      });

      it("should return error for invalid email without domain", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          email: "invalid@",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Please enter a valid email address")
            )
          ).toBe(true);
        }
      });

      it("should accept valid email", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          email: "test@example.com",
        });
        expect(result.success).toBe(true);
      });

      it("should accept email with subdomain", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          email: "test@mail.example.com",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("password validation", () => {
      it("should return error for password shorter than 8 characters", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Pass1!",
          confirmPassword: "Pass1!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Password must be at least 8 characters")
            )
          ).toBe(true);
        }
      });

      it("should return error for password longer than 100 characters", () => {
        const llong = "a".repeat(98);
        const longPassword = `P1!${llong}`;
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: longPassword,
          confirmPassword: longPassword,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Password must be less than 100 characters"
              )
            )
          ).toBe(true);
        }
      });

      it("should return error for password without lowercase letter", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "PASSWORD123!",
          confirmPassword: "PASSWORD123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("lowercase letter")
            )
          ).toBe(true);
        }
      });

      it("should return error for password without uppercase letter", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "password123!",
          confirmPassword: "password123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("uppercase letter")
            )
          ).toBe(true);
        }
      });

      it("should return error for password without number", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Password!",
          confirmPassword: "Password!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("number")
            )
          ).toBe(true);
        }
      });

      it("should return error for password without special character", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Password123",
          confirmPassword: "Password123",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("special character")
            )
          ).toBe(true);
        }
      });

      it("should accept valid password", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Password123!",
          confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
      });

      it("should accept all valid special characters", () => {
        const specialChars = ["@", "$", "!", "%", "*", "?", "&"];

        specialChars.forEach((char) => {
          const password = `Password1${char}`;
          const result = signUpFormSchema.safeParse({
            ...validFormData,
            password,
            confirmPassword: password,
          });
          expect(result.success).toBe(true);
        });
      });
    });

    describe("confirmPassword validation", () => {
      it("should return error when passwords do not match", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Password123!",
          confirmPassword: "DifferentPassword123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Passwords do not match")
            )
          ).toBe(true);
        }
      });

      it("should accept when passwords match", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          password: "Password123!",
          confirmPassword: "Password123!",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("firstName validation", () => {
      it("should return error for empty first name", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          firstName: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("First name is required")
            )
          ).toBe(true);
        }
      });

      it("should return error for first name longer than 100 characters", () => {
        const longName = "a".repeat(101);
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          firstName: longName,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "First name must be less than 100 characters"
              )
            )
          ).toBe(true);
        }
      });

      it("should accept valid first name", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          firstName: "John",
        });
        expect(result.success).toBe(true);
      });
    });

    describe("lastName validation", () => {
      it("should return error for empty last name", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          lastName: "",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes("Last name is required")
            )
          ).toBe(true);
        }
      });

      it("should return error for last name longer than 100 characters", () => {
        const longName = "a".repeat(101);
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          lastName: longName,
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.issues.some((issue) =>
              issue.message.includes(
                "Last name must be less than 100 characters"
              )
            )
          ).toBe(true);
        }
      });

      it("should accept valid last name", () => {
        const result = signUpFormSchema.safeParse({
          ...validFormData,
          lastName: "Doe",
        });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("initialSignUpValues", () => {
    it("should have correct initial values", () => {
      expect(initialSignUpValues).toEqual({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
      });
    });

    it("should have all fields as empty strings", () => {
      expect(initialSignUpValues.username).toBe("");
      expect(initialSignUpValues.email).toBe("");
      expect(initialSignUpValues.password).toBe("");
      expect(initialSignUpValues.confirmPassword).toBe("");
      expect(initialSignUpValues.firstName).toBe("");
      expect(initialSignUpValues.lastName).toBe("");
    });
  });
});
