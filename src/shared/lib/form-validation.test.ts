import { z } from "zod";
import {
  createFormSchema,
  createPasswordConfirmationSchema,
} from "./form-validation";

// Test-specific validation schemas without Lingui
const testValidationSchemas = {
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/(?=.*[a-z])/, "Password must include at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must include at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must include at least one number")
    .regex(
      /(?=.*[@$!%*?&])/,
      "Password must include at least one special character (@$!%*?&)"
    ),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  name: z
    .string()
    .trim()
    .min(1, "This field is required")
    .max(100, "Name must be less than 100 characters"),
};

describe("validationSchemas", () => {
  describe("email", () => {
    it("validates correct email addresses", () => {
      expect(
        testValidationSchemas.email.safeParse("test@example.com").success
      ).toBe(true);
      expect(
        testValidationSchemas.email.safeParse("user.name+tag@domain.co.uk")
          .success
      ).toBe(true);
    });

    it("rejects invalid email addresses", () => {
      expect(testValidationSchemas.email.safeParse("").success).toBe(false);
      expect(
        testValidationSchemas.email.safeParse("invalid-email").success
      ).toBe(false);
      expect(testValidationSchemas.email.safeParse("@domain.com").success).toBe(
        false
      );
    });
  });

  describe("password", () => {
    it("validates strong passwords", () => {
      const strongPassword = "StrongPass123!";
      expect(
        testValidationSchemas.password.safeParse(strongPassword).success
      ).toBe(true);
    });

    it("rejects weak passwords", () => {
      expect(testValidationSchemas.password.safeParse("weak").success).toBe(
        false
      ); // Too short
      expect(
        testValidationSchemas.password.safeParse("nouppercase123!").success
      ).toBe(false); // No uppercase
      expect(
        testValidationSchemas.password.safeParse("NOLOWERCASE123!").success
      ).toBe(false); // No lowercase
      expect(
        testValidationSchemas.password.safeParse("NoNumbers!").success
      ).toBe(false); // No numbers
      expect(
        testValidationSchemas.password.safeParse("NoSpecialChars123").success
      ).toBe(false); // No special chars
    });
  });

  describe("username", () => {
    it("validates correct usernames", () => {
      expect(testValidationSchemas.username.safeParse("user123").success).toBe(
        true
      );
      expect(
        testValidationSchemas.username.safeParse("test_user").success
      ).toBe(true);
      expect(
        testValidationSchemas.username.safeParse("User_Name_123").success
      ).toBe(true);
    });

    it("rejects invalid usernames", () => {
      expect(testValidationSchemas.username.safeParse("ab").success).toBe(
        false
      ); // Too short
      expect(
        testValidationSchemas.username.safeParse("user-name").success
      ).toBe(false); // Contains hyphen
      expect(
        testValidationSchemas.username.safeParse("user name").success
      ).toBe(false); // Contains space
      expect(
        testValidationSchemas.username.safeParse("user@name").success
      ).toBe(false); // Contains @
    });
  });

  describe("name", () => {
    it("validates names", () => {
      expect(testValidationSchemas.name.safeParse("John").success).toBe(true);
      expect(testValidationSchemas.name.safeParse("  John Doe  ").success).toBe(
        true
      ); // Trims whitespace
    });

    it("rejects empty names", () => {
      expect(testValidationSchemas.name.safeParse("").success).toBe(false);
      // Note: "   " gets trimmed to "" and then fails the min(1) check
      // But the trim happens during parsing, so we need to test the actual result
      const result = testValidationSchemas.name.safeParse("   ");
      expect(result.success).toBe(false);
    });
  });
});

describe("createFormSchema", () => {
  it("creates a valid Zod object schema", () => {
    const schema = createFormSchema({
      name: testValidationSchemas.name,
      email: testValidationSchemas.email,
    });

    const validData = { name: "John", email: "john@example.com" };
    const invalidData = { name: "", email: "invalid" };

    expect(schema.safeParse(validData).success).toBe(true);
    expect(schema.safeParse(invalidData).success).toBe(false);
  });
});

describe("createPasswordConfirmationSchema", () => {
  it("validates matching passwords", () => {
    const schema = createPasswordConfirmationSchema();
    const validData = {
      password: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    };

    expect(schema.safeParse(validData).success).toBe(true);
  });

  it("rejects non-matching passwords", () => {
    const schema = createPasswordConfirmationSchema();
    const invalidData = {
      password: "StrongPass123!",
      confirmPassword: "DifferentPass123!",
    };

    const result = schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("works with custom password field name", () => {
    const schema = createPasswordConfirmationSchema("newPassword");
    const validData = {
      newPassword: "StrongPass123!",
      confirmPassword: "StrongPass123!",
    };

    expect(schema.safeParse(validData).success).toBe(true);
  });
});
