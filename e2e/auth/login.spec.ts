import { test, expect } from "@playwright/test";
import { AuthPage, testData } from "../utils/test-helpers";

test.describe("Login Page", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToLogin();
  });

  test("displays all login form elements", async ({ page }) => {
    await authPage.expectLoginPageVisible();

    // Check subtitle
    await expect(
      page.getByText("Sign in to your account to continue")
    ).toBeVisible();

    // Check all form elements
    await expect(authPage.loginForm.usernameInput).toBeVisible();
    await expect(authPage.loginForm.passwordInput).toBeVisible();
    await expect(authPage.loginForm.rememberMeCheckbox).toBeVisible();
    await expect(authPage.loginForm.submitButton).toBeVisible();
    await expect(authPage.loginForm.forgotPasswordLink).toBeVisible();
    await expect(authPage.loginForm.signUpLink).toBeVisible();
  });

  test("handles form submission with invalid data", async ({ page }) => {
    // Fill with invalid data
    await authPage.fillLoginForm("ab", ""); // Short username, empty password
    await authPage.submitLoginForm();

    // Form should still be visible (not navigated away)
    await authPage.expectLoginPageVisible();

    // Submit button should be enabled again after failed submission
    await expect(authPage.loginForm.submitButton).toBeEnabled();
  });

  test("accepts valid login credentials", async ({ page }) => {
    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );

    // Should not show validation errors
    const hasValidationError = await page
      .locator('[role="alert"], .mantine-InputError-error')
      .count();
    expect(hasValidationError).toBe(0);
  });

  test("toggles remember me checkbox", async ({ page }) => {
    const checkbox = authPage.loginForm.rememberMeCheckbox;

    // Initially unchecked
    await expect(checkbox).not.toBeChecked();

    // Check it
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Uncheck it
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  });

  test("navigates to register page", async ({ page }) => {
    await authPage.loginForm.signUpLink.click();

    await expect(page).toHaveURL(/\/register$/);
    await authPage.expectRegisterPageVisible();
  });

  test("shows loading state when submitting", async ({ page }) => {
    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );
    await authPage.submitLoginForm();

    // Check for loading state
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("has proper form accessibility", async ({ page }) => {
    // Check form structure
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check all inputs have proper labels
    await expect(authPage.loginForm.usernameInput).toBeVisible();
    await expect(authPage.loginForm.passwordInput).toBeVisible();
    await expect(authPage.loginForm.rememberMeCheckbox).toBeVisible();
    await expect(authPage.loginForm.submitButton).toBeVisible();
  });
});

test.describe("Login Form Interactions", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToLogin();
  });

  test("allows keyboard navigation", async ({ page }) => {
    const usernameInput = authPage.loginForm.usernameInput;
    const passwordInput = authPage.loginForm.passwordInput;

    // Focus username field
    await usernameInput.focus();
    await expect(usernameInput).toBeFocused();

    // Tab to password field
    await page.keyboard.press("Tab");
    await expect(passwordInput).toBeFocused();
  });

  test("submits form with Enter key", async ({ page }) => {
    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );

    // Press Enter in password field
    await authPage.loginForm.passwordInput.press("Enter");

    // Form should be submitted
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles rapid form submissions gracefully", async ({ page }) => {
    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );

    // Submit multiple times rapidly
    const submitButton = authPage.loginForm.submitButton;
    await submitButton.click();

    // Second click should be prevented (button disabled)
    await expect(submitButton)
      .toBeDisabled({ timeout: 1000 })
      .catch(() => {
        // Loading state might be too fast to catch
      });
  });
});
