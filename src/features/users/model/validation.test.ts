import { describe, it, expect } from "vitest";
import {
  userFormSchema,
  initialUserValues,
  createInitialUserValues,
} from "./validation";

describe("user form validation", () => {
  describe("userFormSchema", () => {
    describe("firstName validation", () => {
      it("should return error for empty first name", () => {
        const result = userFormSchema.safeParse({
          firstName: "",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "First name is required"
          );
        }
      });

      it("should accept valid first name", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("lastName validation", () => {
      it("should return error for empty last name", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "Last name is required"
          );
        }
      });

      it("should accept valid last name", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("username validation", () => {
      it("should return error for username shorter than 3 characters", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "jo",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "at least 3 characters"
          );
        }
      });

      it("should return error for username with special characters", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "john@doe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "letters, numbers, and underscores"
          );
        }
      });

      it("should accept valid username", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "john_doe123",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("email validation", () => {
      it("should return error for invalid email", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "invalid-email",
          role: "user",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain("valid email");
        }
      });

      it("should accept valid email", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john.doe@example.com",
          role: "user",
        });

        expect(result.success).toBe(true);
      });
    });

    describe("role validation", () => {
      it("should return error for invalid role", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "invalid",
        });

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].message).toContain(
            "Invalid enum value"
          );
        }
      });

      it("should accept user role", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "user",
        });

        expect(result.success).toBe(true);
      });

      it("should accept admin role", () => {
        const result = userFormSchema.safeParse({
          firstName: "John",
          lastName: "Doe",
          username: "johndoe",
          email: "john@example.com",
          role: "admin",
        });

        expect(result.success).toBe(true);
      });
    });
  });

  describe("initialUserValues", () => {
    it("should have correct initial values", () => {
      expect(initialUserValues).toEqual({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        role: "user",
      });
    });
  });

  describe("createInitialUserValues", () => {
    it("should return default values when no user provided", () => {
      const result = createInitialUserValues();
      expect(result).toEqual(initialUserValues);
    });

    it("should merge provided user data with defaults", () => {
      const user = {
        firstName: "John",
        email: "john@example.com",
      };

      const result = createInitialUserValues(user);
      expect(result).toEqual({
        firstName: "John",
        lastName: "",
        username: "",
        email: "john@example.com",
        role: "user",
      });
    });
  });
});
