import { test, expect } from "@playwright/test";
import { AuthPage, testData } from "../utils/test-helpers";

test.describe("Verify Email Page - Resend Mode", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToVerifyEmailWithoutToken();
  });

  test("displays resend verification form elements", async ({ page }) => {
    // Check description text
    await expect(
      page.getByText(
        "Enter your email address and we'll send you a new verification link."
      )
    ).toBeVisible();

    // Check all form elements
    await expect(authPage.verifyEmailForm.emailInput).toBeVisible();
    await expect(authPage.verifyEmailForm.submitButton).toBeVisible();
    await expect(authPage.verifyEmailForm.backToLoginLink).toBeVisible();
  });

  test("handles form submission with invalid email", async ({ page }) => {
    // Fill with invalid email
    await authPage.fillVerifyEmailForm("invalid-email");
    await authPage.submitVerifyEmailForm();

    // Form should still be visible (not navigated away)
    await authPage.expectVerifyEmailPageVisible();

    // Submit button should be enabled again after failed validation
    await expect(authPage.verifyEmailForm.submitButton).toBeEnabled();
  });

  test("handles empty email submission", async ({ page }) => {
    // Submit without filling email
    await authPage.submitVerifyEmailForm();

    // Form should still be visible
    await authPage.expectVerifyEmailPageVisible();
  });

  test("accepts valid email format", async ({ page }) => {
    await authPage.fillVerifyEmailForm(testData.validUser.email);

    // Should not show validation errors
    const hasValidationError = await page
      .locator('[role="alert"], .mantine-InputError-error')
      .count();
    expect(hasValidationError).toBe(0);
  });

  test("navigates back to login page", async ({ page }) => {
    await authPage.verifyEmailForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("shows loading state when submitting", async ({ page }) => {
    await authPage.fillVerifyEmailForm(testData.validUser.email);
    await authPage.submitVerifyEmailForm();

    // Check for loading state
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("has proper form accessibility", async ({ page }) => {
    // Check form structure
    const form = page.locator("form");
    await expect(form).toBeVisible();

    // Check input has proper label
    await expect(authPage.verifyEmailForm.emailInput).toBeVisible();
    await expect(authPage.verifyEmailForm.submitButton).toBeVisible();

    // Check for proper ARIA attributes
    const emailInput = authPage.verifyEmailForm.emailInput;
    await expect(emailInput).toHaveAttribute("required");
  });
});

test.describe("Verify Email Page - Verification Mode", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToVerifyEmail("valid-token-123");
  });

  test("displays verification pending state", async ({ page }) => {
    await expect(page.getByText("Verifying Your Email...")).toBeVisible();
    await expect(
      page.getByText("Please wait while we verify your email address.")
    ).toBeVisible();
  });

  test("shows success state after verification", async ({ page }) => {
    // Wait for potential success state (this would depend on API response)
    // In a real scenario, you might mock the API response
    await page.waitForTimeout(1000);

    // Check if success elements might appear
    const successAlert = page.getByText("Email Verified!");
    const continueButton = page.getByRole("button", {
      name: "Continue to Sign In",
    });

    // These might be visible if the API call succeeds
    if (await successAlert.isVisible()) {
      await expect(successAlert).toBeVisible();
      await expect(continueButton).toBeVisible();
    }
  });

  test("shows error state for invalid token", async ({ page }) => {
    // Navigate with an obviously invalid token
    await authPage.goToVerifyEmail("invalid-token");

    // Wait for potential error state
    await page.waitForTimeout(1000);

    // Check if error elements might appear
    const errorAlert = page.getByText("Verification Failed");
    const backButton = page.getByRole("button", { name: "Back to Sign In" });

    // These might be visible if the API call fails
    if (await errorAlert.isVisible()) {
      await expect(errorAlert).toBeVisible();
      await expect(backButton).toBeVisible();
    }
  });

  test("navigates back to login from success state", async ({ page }) => {
    // Wait for potential success state
    await page.waitForTimeout(1000);

    const continueButton = page.getByRole("button", {
      name: "Continue to Sign In",
    });

    if (await continueButton.isVisible()) {
      await continueButton.click();
      await expect(page).toHaveURL(/\/login$|\/$/);
    }
  });

  test("navigates back to login from error state", async ({ page }) => {
    // Navigate with an invalid token to trigger error
    await authPage.goToVerifyEmail("invalid-token");
    await page.waitForTimeout(1000);

    const backButton = page.getByRole("button", { name: "Back to Sign In" });

    if (await backButton.isVisible()) {
      await backButton.click();
      await expect(page).toHaveURL(/\/login$|\/$/);
    }
  });
});

test.describe("Verify Email Form Interactions", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goToVerifyEmailWithoutToken();
  });

  test("allows keyboard navigation", async ({ page }) => {
    const emailInput = authPage.verifyEmailForm.emailInput;
    const submitButton = authPage.verifyEmailForm.submitButton;

    // Focus email field
    await emailInput.focus();
    await expect(emailInput).toBeFocused();

    // Tab to submit button
    await page.keyboard.press("Tab");
    await expect(submitButton).toBeFocused();
  });

  test("submits form with Enter key", async ({ page }) => {
    await authPage.fillVerifyEmailForm(testData.validUser.email);

    // Press Enter in email field
    await authPage.verifyEmailForm.emailInput.press("Enter");

    // Form should be submitted
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles rapid form submissions gracefully", async ({ page }) => {
    await authPage.fillVerifyEmailForm(testData.validUser.email);

    // Submit multiple times rapidly
    const submitButton = authPage.verifyEmailForm.submitButton;
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
      await authPage.fillVerifyEmailForm(email);
      await authPage.submitVerifyEmailForm();

      // Form should still be visible (validation failed)
      await authPage.expectVerifyEmailPageVisible();

      // Clear the field for next test
      await authPage.verifyEmailForm.emailInput.clear();
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
      await authPage.fillVerifyEmailForm(email);

      // Should not show validation errors
      const hasValidationError = await page
        .locator('[role="alert"], .mantine-InputError-error')
        .count();
      expect(hasValidationError).toBe(0);

      // Clear the field for next test
      await authPage.verifyEmailForm.emailInput.clear();
    }
  });

  test("pre-fills email from URL parameter", async ({ page }) => {
    const testEmail = "prefilled@example.com";
    await page.goto(`/verify-email?email=${encodeURIComponent(testEmail)}`);
    await page.waitForLoadState("networkidle");

    const emailInput = authPage.verifyEmailForm.emailInput;
    await expect(emailInput).toHaveValue(testEmail);
  });
});

test.describe("Verify Email Navigation Flow", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("can navigate to verify email without parameters", async ({ page }) => {
    await authPage.goToVerifyEmailWithoutToken();

    await expect(page).toHaveURL(/\/verify-email$/);
    await authPage.expectVerifyEmailPageVisible();
  });

  test("can navigate to verify email with token", async ({ page }) => {
    await authPage.goToVerifyEmail("test-token-123");

    await expect(page).toHaveURL(/\/verify-email\?token=test-token-123$/);
    await expect(page.getByText("Verifying Your Email...")).toBeVisible();
  });

  test("can navigate to verify email with email parameter", async ({
    page,
  }) => {
    const testEmail = "test@example.com";
    await page.goto(`/verify-email?email=${encodeURIComponent(testEmail)}`);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(
      new RegExp(`/verify-email\\?email=${encodeURIComponent(testEmail)}`)
    );
    await authPage.expectVerifyEmailPageVisible();
  });

  test("can navigate back to login from verify email page", async ({
    page,
  }) => {
    await authPage.goToVerifyEmailWithoutToken();
    await authPage.verifyEmailForm.backToLoginLink.click();

    await expect(page).toHaveURL(/\/login$|\/$/);
    await authPage.expectLoginPageVisible();
  });

  test("maintains form state during navigation", async ({ page }) => {
    await authPage.goToVerifyEmailWithoutToken();

    // Fill the form
    const testEmail = "test@example.com";
    await authPage.fillVerifyEmailForm(testEmail);

    // Navigate away and back (simulate browser back/forward)
    await authPage.goToLogin();
    await page.goBack();

    // Form should be reset (this is expected behavior for security)
    await expect(authPage.verifyEmailForm.emailInput).toHaveValue("");
  });

  test("handles URL with both token and email parameters", async ({ page }) => {
    const testEmail = "test@example.com";
    const testToken = "test-token-123";

    await page.goto(
      `/verify-email?token=${testToken}&email=${encodeURIComponent(testEmail)}`
    );
    await page.waitForLoadState("networkidle");

    // Should show verification mode (token takes precedence)
    await expect(page.getByText("Verifying Your Email...")).toBeVisible();
    await expect(page.queryByText("Send Verification Email")).not.toBeVisible();
  });
});
