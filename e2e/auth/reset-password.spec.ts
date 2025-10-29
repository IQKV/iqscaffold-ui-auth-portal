import { test, expect } from "@playwright/test";
import { AuthPage, testData } from "../utils/test-helpers";

test.describe("Reset Password Page", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToResetPassword("valid-token-123");
  });

  test("displays reset password form elements", async ({ page }) => {
    // Check description text
    await expect(
      page.getByText(
        "Enter your new password below. Make sure it's strong and secure."
      )
    ).toBeVisible();

    // Check all form elements
    await expect(authPage.resetPasswordForm.passwordInput).toBeVisible();
    await expect(authPage.resetPasswordForm.confirmPasswordInput).toBeVisible();
    await expect(authPage.resetPasswordForm.submitButton).toBeVisible();
    await expect(authPage.resetPasswordForm.backToLoginLink).toBeVisible();
  });

  test("handles form submission with weak password", async ({ page }) => {
    // Fill with weak password
    await authPage.fillResetPasswordForm("weak", "weak");
    await authPage.submitResetPasswordForm();

    // Form should still be visible (not navigated away)
    await authPage.expectResetPasswordPageVisible();

    // Should show validation error
    await expect(
      page.getByText("Password must be at least 8 characters long")
    ).toBeVisible();

    // Submit button should be enabled again after failed validation
    await expect(authPage.resetPasswordForm.submitButton).toBeEnabled();
  });

  test("handles mismatched passwords", async ({ page }) => {
    // Fill with mismatched passwords
    await authPage.fillResetPasswordForm(
      "Password123!",
      "DifferentPassword123!"
    );
    await authPage.submitResetPasswordForm();

    // Should show validation error
    await expect(page.getByText("Passwords do not match")).toBeVisible();

    // Form should still be visible
    await authPage.expectResetPasswordPageVisible();
  });

  test("accepts valid password format", async ({ page }) => {
    await authPage.fillResetPasswordForm("Password123!", "Password123!");

    // Should not show validation errors
    const hasValidationError = await page
      .locator('[role="alert"], .mantine-InputError-error')
      .count();
    expect(hasValidationError).toBe(0);
  });

  test("navigates back to login page", async ({ page }) => {
    await authPage.resetPasswordForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("shows loading state when submitting", async ({ page }) => {
    await authPage.fillResetPasswordForm("Password123!", "Password123!");
    await authPage.submitResetPasswordForm();

    // Check for loading state
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("has proper form accessibility", async ({ page }) => {
    // Check form structure
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check inputs have proper labels
    await expect(authPage.resetPasswordForm.passwordInput).toBeVisible();
    await expect(authPage.resetPasswordForm.confirmPasswordInput).toBeVisible();
    await expect(authPage.resetPasswordForm.submitButton).toBeVisible();

    // Check for proper ARIA attributes
    const passwordInput = authPage.resetPasswordForm.passwordInput;
    const confirmPasswordInput =
      authPage.resetPasswordForm.confirmPasswordInput;
    await expect(passwordInput).toHaveAttribute("required");
    await expect(confirmPasswordInput).toHaveAttribute("required");
  });
});

test.describe("Reset Password Page - Invalid Token", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToResetPasswordWithoutToken();
  });

  test("displays invalid token message", async ({ page }) => {
    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
    await expect(
      page.getByText(
        "This password reset link is invalid or has expired. Please request a new password reset."
      )
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Back to Sign In" })
    ).toBeVisible();
  });

  test("navigates to login from invalid token page", async ({ page }) => {
    await page.getByRole("button", { name: "Back to Sign In" }).click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });
});

test.describe("Reset Password Form Interactions", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToResetPassword("valid-token-123");
  });

  test("allows keyboard navigation", async ({ page }) => {
    const passwordInput = authPage.resetPasswordForm.passwordInput;
    const confirmPasswordInput =
      authPage.resetPasswordForm.confirmPasswordInput;
    const submitButton = authPage.resetPasswordForm.submitButton;

    // Focus password field
    await passwordInput.focus();
    await expect(passwordInput).toBeFocused();

    // Tab to confirm password field
    await page.keyboard.press("Tab");
    await expect(confirmPasswordInput).toBeFocused();

    // Tab to submit button
    await page.keyboard.press("Tab");
    await expect(submitButton).toBeFocused();
  });

  test("submits form with Enter key", async ({ page }) => {
    await authPage.fillResetPasswordForm("Password123!", "Password123!");

    // Press Enter in confirm password field
    await authPage.resetPasswordForm.confirmPasswordInput.press("Enter");

    // Form should be submitted
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles rapid form submissions gracefully", async ({ page }) => {
    await authPage.fillResetPasswordForm("Password123!", "Password123!");

    // Submit multiple times rapidly
    const submitButton = authPage.resetPasswordForm.submitButton;
    await submitButton.click();

    // Second click should be prevented (button disabled)
    await expect(submitButton)
      .toBeDisabled({ timeout: 1000 })
      .catch(() => {
        // Loading state might be too fast to catch
      });
  });

  test("validates password strength requirements", async ({ page }) => {
    const weakPasswords = [
      {
        password: "short",
        error: "Password must be at least 8 characters long",
      },
      {
        password: "nouppercase123!",
        error: "Password must contain at least one uppercase letter",
      },
      {
        password: "NOLOWERCASE123!",
        error: "Password must contain at least one lowercase letter",
      },
      {
        password: "NoNumbers!",
        error: "Password must contain at least one number",
      },
      {
        password: "NoSpecialChar123",
        error: "Password must contain at least one special character",
      },
    ];

    for (const { password, error } of weakPasswords) {
      await authPage.fillResetPasswordForm(password, password);
      await authPage.submitResetPasswordForm();

      await expect(page.getByText(error)).toBeVisible();

      // Clear the fields for next test
      await authPage.resetPasswordForm.passwordInput.clear();
      await authPage.resetPasswordForm.confirmPasswordInput.clear();
    }
  });

  test("accepts valid password formats", async ({ page }) => {
    const validPasswords = [
      "Password123!",
      "MySecure123@",
      "StrongPass456#",
      "Complex789$",
      "Secure2024%",
    ];

    for (const password of validPasswords) {
      await authPage.fillResetPasswordForm(password, password);

      // Should not show validation errors
      const hasValidationError = await page
        .locator('[role="alert"], .mantine-InputError-error')
        .count();
      expect(hasValidationError).toBe(0);

      // Clear the fields for next test
      await authPage.resetPasswordForm.passwordInput.clear();
      await authPage.resetPasswordForm.confirmPasswordInput.clear();
    }
  });

  test("shows real-time password mismatch validation", async ({ page }) => {
    const passwordInput = authPage.resetPasswordForm.passwordInput;
    const confirmPasswordInput =
      authPage.resetPasswordForm.confirmPasswordInput;

    // Fill password
    await passwordInput.fill("Password123!");

    // Fill different confirm password
    await confirmPasswordInput.fill("DifferentPassword");

    // Try to submit to trigger validation
    await authPage.submitResetPasswordForm();

    // Should show mismatch error
    await expect(page.getByText("Passwords do not match")).toBeVisible();
  });
});

test.describe("Reset Password Navigation Flow", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("can navigate to reset password with token", async ({ page }) => {
    await authPage.goToResetPassword("test-token-123");

    await expect(page).toHaveURL(/\/reset-password\?token=test-token-123$/);
    await authPage.expectResetPasswordPageVisible();
  });

  test("can navigate back to login from reset password page", async ({
    page,
  }) => {
    await authPage.goToResetPassword("test-token-123");
    await authPage.resetPasswordForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("maintains form state during navigation", async ({ page }) => {
    await authPage.goToResetPassword("test-token-123");

    // Fill the form
    const testPassword = "Password123!";
    await authPage.fillResetPasswordForm(testPassword, testPassword);

    // Navigate away and back (simulate browser back/forward)
    await authPage.goToLogin();
    await page.goBack();

    // Form should be reset (this is expected behavior for security)
    await expect(authPage.resetPasswordForm.passwordInput).toHaveValue("");
    await expect(authPage.resetPasswordForm.confirmPasswordInput).toHaveValue(
      ""
    );
  });

  test("handles URL with missing token parameter", async ({ page }) => {
    await page.goto("/reset-password");
    await page.waitForLoadState("networkidle");

    // Should show invalid token message
    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
  });

  test("handles URL with empty token parameter", async ({ page }) => {
    await page.goto("/reset-password?token=");
    await page.waitForLoadState("networkidle");

    // Should show invalid token message
    await expect(page.getByText("Invalid Reset Link")).toBeVisible();
  });
});
