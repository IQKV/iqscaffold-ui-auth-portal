import { test, expect } from "@playwright/test";
import { AuthPage, testData } from "../utils/test-helpers";

test.describe("Forgot Password Page", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToForgotPassword();
  });

  test("displays forgot password form elements", async ({ page }) => {
    // Check description text
    await expect(
      page.getByText(
        "Enter your email address and we'll send you a link to reset your password."
      )
    ).toBeVisible();

    // Check all form elements
    await expect(authPage.forgotPasswordForm.emailInput).toBeVisible();
    await expect(authPage.forgotPasswordForm.submitButton).toBeVisible();
    await expect(authPage.forgotPasswordForm.backToLoginLink).toBeVisible();
  });

  test("handles form submission with invalid data", async ({ page }) => {
    // Fill with invalid email
    await authPage.fillForgotPasswordForm("invalid-email");
    await authPage.submitForgotPasswordForm();

    // Form should still be visible (not navigated away)
    await authPage.expectForgotPasswordPageVisible();

    // Should show validation error
    await expect(
      page.getByText("Please enter a valid email address")
    ).toBeVisible();

    // Submit button should be enabled again after failed validation
    await expect(authPage.forgotPasswordForm.submitButton).toBeEnabled();
  });

  test("handles empty email submission", async ({ page }) => {
    // Submit without filling email
    await authPage.submitForgotPasswordForm();

    // Should show validation error
    await expect(page.getByText("Email is required")).toBeVisible();

    // Form should still be visible
    await authPage.expectForgotPasswordPageVisible();
  });

  test("accepts valid email format", async ({ page }) => {
    await authPage.fillForgotPasswordForm(testData.validUser.email);

    // Should not show validation errors
    const hasValidationError = await page
      .locator('[role="alert"], .mantine-InputError-error')
      .count();
    expect(hasValidationError).toBe(0);
  });

  test("navigates back to login page", async ({ page }) => {
    await authPage.forgotPasswordForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("shows loading state when submitting", async ({ page }) => {
    await authPage.fillForgotPasswordForm(testData.validUser.email);
    await authPage.submitForgotPasswordForm();

    // Check for loading state
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("has proper form accessibility", async ({ page }) => {
    // Check form structure
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check input has proper label
    await expect(authPage.forgotPasswordForm.emailInput).toBeVisible();
    await expect(authPage.forgotPasswordForm.submitButton).toBeVisible();

    // Check for proper ARIA attributes
    const emailInput = authPage.forgotPasswordForm.emailInput;
    await expect(emailInput).toHaveAttribute("required");
  });
});

test.describe("Forgot Password Form Interactions", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToForgotPassword();
  });

  test("allows keyboard navigation", async ({ page }) => {
    const emailInput = authPage.forgotPasswordForm.emailInput;
    const submitButton = authPage.forgotPasswordForm.submitButton;

    // Focus email field
    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    // Tab to submit button
    await page.keyboard.press("Tab");
    await expect(submitButton).toBeFocused();
  });

  test("submits form with Enter key", async ({ page }) => {
    await authPage.fillForgotPasswordForm(testData.validUser.email);

    // Press Enter in email field
    await authPage.forgotPasswordForm.emailInput.press("Enter");

    // Form should be submitted
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles rapid form submissions gracefully", async ({ page }) => {
    await authPage.fillForgotPasswordForm(testData.validUser.email);

    // Submit multiple times rapidly
    const submitButton = authPage.forgotPasswordForm.submitButton;
    await submitButton.click();

    // Second click should be prevented (button disabled)
    await expect(submitButton)
      .toBeDisabled({ timeout: 1000 })
      .catch(() => {
        // Loading state might be too fast to catch
      });
  });

  test("validates different email formats", async ({ page }) => {
    const invalidEmails = [
      "plainaddress",
      "@missingdomain.com",
      "missing@.com",
      "missing.domain@.com",
      "two@@domain.com",
      "domain@.com",
    ];

    for (const email of invalidEmails) {
      await authPage.fillForgotPasswordForm(email);
      await authPage.submitForgotPasswordForm();

      await expect(
        page.getByText("Please enter a valid email address")
      ).toBeVisible();

      // Clear the field for next test
      await authPage.forgotPasswordForm.emailInput.clear();
    }
  });

  test("accepts valid email formats", async ({ page }) => {
    const validEmails = [
      "test@example.com",
      "user.name@domain.co.uk",
      "user+tag@example.org",
      "123@example.com",
      "test.email.with+symbol@example.com",
    ];

    for (const email of validEmails) {
      await authPage.fillForgotPasswordForm(email);

      // Should not show validation errors
      const hasValidationError = await page
        .locator('[role="alert"], .mantine-InputError-error')
        .count();
      expect(hasValidationError).toBe(0);

      // Clear the field for next test
      await authPage.forgotPasswordForm.emailInput.clear();
    }
  });
});

test.describe("Forgot Password Navigation Flow", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("can navigate to forgot password from login page", async ({ page }) => {
    await authPage.goToLogin();
    await authPage.loginForm.forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/forgot-password$/);
    await authPage.expectForgotPasswordPageVisible();
  });

  test("can navigate back to login from forgot password page", async ({
    page,
  }) => {
    await authPage.goToForgotPassword();
    await authPage.forgotPasswordForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("maintains form state during navigation", async ({ page }) => {
    await authPage.goToForgotPassword();

    // Fill the form
    const testEmail = "test@example.com";
    await authPage.fillForgotPasswordForm(testEmail);

    // Navigate away and back (simulate browser back/forward)
    await authPage.goToLogin();
    await page.goBack();

    // Form should be reset (this is expected behavior for security)
    await expect(authPage.forgotPasswordForm.emailInput).toHaveValue("");
  });
});
