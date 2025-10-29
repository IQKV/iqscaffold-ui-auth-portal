import { test, expect } from "@playwright/test";
import { AuthPage, testData } from "../utils/test-helpers";

test.describe("Register Page", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToRegister();
  });

  test("displays all registration form elements", async ({ page }) => {
    await authPage.expectRegisterPageVisible();

    // Check subtitle
    await expect(
      page.getByText("Join IQKV and start your journey")
    ).toBeVisible();

    // Check all form fields
    await expect(authPage.registerForm.firstNameInput).toBeVisible();
    await expect(authPage.registerForm.lastNameInput).toBeVisible();
    await expect(authPage.registerForm.usernameInput).toBeVisible();
    await expect(authPage.registerForm.emailInput).toBeVisible();
    await expect(authPage.registerForm.passwordInput).toBeVisible();
    await expect(authPage.registerForm.confirmPasswordInput).toBeVisible();
    await expect(authPage.registerForm.submitButton).toBeVisible();
    await expect(authPage.registerForm.signInLink).toBeVisible();
  });

  test("handles form submission with invalid data", async ({ page }) => {
    // Fill with invalid data
    await authPage.fillRegisterForm({
      firstName: "", // Empty
      lastName: "", // Empty
      username: "ab", // Too short
      email: "invalid-email", // Invalid format
      password: "weak", // Too weak
    });
    await authPage.submitRegisterForm();

    // Form should still be visible (not navigated away)
    await authPage.expectRegisterPageVisible();

    // Submit button should be enabled again after failed submission
    await expect(authPage.registerForm.submitButton).toBeEnabled();
  });

  test("accepts different username formats", async ({ page }) => {
    // Test that the username field accepts input
    await authPage.registerForm.usernameInput.fill(
      testData.invalidData.shortUsername
    );
    await expect(authPage.registerForm.usernameInput).toHaveValue(
      testData.invalidData.shortUsername
    );

    // Test clearing and filling with different value
    await authPage.registerForm.usernameInput.clear();
    await authPage.registerForm.usernameInput.fill("validusername123");
    await expect(authPage.registerForm.usernameInput).toHaveValue(
      "validusername123"
    );
  });

  test("accepts email input", async ({ page }) => {
    // Test that the email field accepts input
    await authPage.registerForm.emailInput.fill(
      testData.invalidData.invalidEmail
    );
    await expect(authPage.registerForm.emailInput).toHaveValue(
      testData.invalidData.invalidEmail
    );

    // Test with valid email
    await authPage.registerForm.emailInput.clear();
    await authPage.registerForm.emailInput.fill("valid@example.com");
    await expect(authPage.registerForm.emailInput).toHaveValue(
      "valid@example.com"
    );
  });

  test("validates password confirmation", async ({ page }) => {
    const userData = testData.generateUniqueUser();
    await authPage.fillRegisterForm({
      ...userData,
      confirmPassword: "DifferentPassword123!",
    });
    await authPage.submitRegisterForm();

    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });

  test("accepts valid registration data", async ({ page }) => {
    const userData = testData.generateUniqueUser();
    await authPage.fillRegisterForm(userData);

    // Should not show validation errors
    const hasValidationError = await page
      .locator('[role="alert"], .mantine-InputError-error')
      .count();
    expect(hasValidationError).toBe(0);
  });

  test("shows helper text for fields", async ({ page }) => {
    // Check for username description
    await expect(
      page.getByText("3-50 characters, letters, numbers, and underscores only")
    ).toBeVisible();

    // Check for password description
    await expect(
      page.getByText(
        "Min 8 characters with uppercase, lowercase, number, and special character"
      )
    ).toBeVisible();
  });

  test("navigates to login page", async ({ page }) => {
    await authPage.registerForm.signInLink.click();

    await expect(page).toHaveURL(/\/?$/);
    await authPage.expectLoginPageVisible();
  });

  test("shows loading state when submitting", async ({ page }) => {
    const userData = testData.generateUniqueUser();
    await authPage.fillRegisterForm(userData);
    await authPage.submitRegisterForm();

    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("has proper form accessibility", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check all inputs are accessible
    await expect(authPage.registerForm.firstNameInput).toBeVisible();
    await expect(authPage.registerForm.lastNameInput).toBeVisible();
    await expect(authPage.registerForm.usernameInput).toBeVisible();
    await expect(authPage.registerForm.emailInput).toBeVisible();
    await expect(authPage.registerForm.passwordInput).toBeVisible();
    await expect(authPage.registerForm.confirmPasswordInput).toBeVisible();
    await expect(authPage.registerForm.submitButton).toBeVisible();
  });
});

test.describe("Register Form Interactions", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToRegister();
  });

  test("allows keyboard navigation", async ({ page }) => {
    const firstNameInput = authPage.registerForm.firstNameInput;
    const lastNameInput = authPage.registerForm.lastNameInput;

    await firstNameInput.focus();
    await expect(firstNameInput).toBeFocused();

    await page.keyboard.press("Tab");
    await expect(lastNameInput).toBeFocused();
  });

  test("submits form with Enter key", async ({ page }) => {
    const userData = testData.generateUniqueUser();
    await authPage.fillRegisterForm(userData);

    await authPage.registerForm.confirmPasswordInput.press("Enter");
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles field interactions correctly", async ({ page }) => {
    const usernameInput = authPage.registerForm.usernameInput;

    // Fill and clear field
    await usernameInput.fill("testuser");
    await expect(usernameInput).toHaveValue("testuser");

    await usernameInput.clear();
    await expect(usernameInput).toHaveValue("");
  });
});
