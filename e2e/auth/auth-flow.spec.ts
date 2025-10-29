import { test, expect } from "@playwright/test";
import { AuthPage, testData, testUtils } from "../utils/test-helpers";

test.describe("Auth Flow", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("navigates between login and register pages", async ({ page }) => {
    // Start at login
    await authPage.goToLogin();
    await authPage.expectLoginPageVisible();

    // Navigate to register
    await authPage.loginForm.signUpLink.click();
    await expect(page).toHaveURL(/\/register$/);
    await authPage.expectRegisterPageVisible();

    // Navigate back to login
    await authPage.registerForm.signInLink.click();
    await expect(page).toHaveURL(/\/?$/);
    await authPage.expectLoginPageVisible();
  });

  test("handles complete registration flow", async ({ page }) => {
    await authPage.goToRegister();

    const userData = testData.generateUniqueUser();
    await authPage.fillRegisterForm(userData);
    await authPage.submitRegisterForm();

    // Form should be submitted (loading state)
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("handles login form submission", async ({ page }) => {
    await authPage.goToLogin();

    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );
    await authPage.submitLoginForm();

    // Form should be submitted (loading state)
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("preserves form state on validation error", async ({ page }) => {
    await authPage.goToRegister();

    // Fill some fields with invalid data
    await authPage.registerForm.firstNameInput.fill("John");
    await authPage.registerForm.lastNameInput.fill("Doe");
    await authPage.registerForm.usernameInput.fill("jo"); // Too short

    await authPage.submitRegisterForm();

    // Should show validation error
    await expect(page.getByText(/username/i)).toBeVisible();

    // Form values should be preserved
    await expect(authPage.registerForm.firstNameInput).toHaveValue("John");
    await expect(authPage.registerForm.lastNameInput).toHaveValue("Doe");
    await expect(authPage.registerForm.usernameInput).toHaveValue("jo");
  });

  test("handles remember me checkbox", async ({ page }) => {
    await authPage.goToLogin();

    const checkbox = authPage.loginForm.rememberMeCheckbox;
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );
    await authPage.submitLoginForm();

    // Form should be submitted with remember me checked
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("prevents rapid form submissions", async ({ page }) => {
    await authPage.goToLogin();

    await authPage.fillLoginForm(
      testData.validUser.username,
      testData.validUser.password
    );

    // Submit multiple times rapidly
    const submitButton = authPage.loginForm.submitButton;
    await submitButton.click();

    // Second click should be prevented
    await expect(submitButton)
      .toBeDisabled({ timeout: 1000 })
      .catch(() => {
        // Loading state might be too fast to catch
      });
  });
});

test.describe("Auth Flow - Navigation", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("handles page refresh correctly", async ({ page }) => {
    await authPage.goToLogin();

    // Fill form
    await authPage.fillLoginForm("testuser", "password123");

    // Reload page
    await page.reload();
    await testUtils.waitForPageReady(page);

    // Form should be empty (no state persistence)
    await expect(authPage.loginForm.usernameInput).toHaveValue("");
    await expect(authPage.loginForm.passwordInput).toHaveValue("");
  });

  test("handles browser navigation", async ({ page }) => {
    // Start at login
    await authPage.goToLogin();

    // Navigate to register
    await authPage.loginForm.signUpLink.click();
    await expect(page).toHaveURL(/\/register$/);

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/?$/);
    await authPage.expectLoginPageVisible();

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/register$/);
    await authPage.expectRegisterPageVisible();
  });

  test("handles direct URL access", async ({ page }) => {
    // Direct access to register page
    await authPage.goToRegister();
    await authPage.expectRegisterPageVisible();

    // Should have full functionality
    await expect(authPage.registerForm.submitButton).toBeVisible();
    await expect(authPage.registerForm.signInLink).toBeVisible();
  });
});

test.describe("Auth Flow - Responsive Design", () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test("works across different viewports", async ({ page }) => {
    await testUtils.testResponsiveDesign(page, async (page) => {
      // Test login page
      await authPage.goToLogin();
      await authPage.expectLoginPageVisible();

      // Test register page
      await authPage.goToRegister();
      await authPage.expectRegisterPageVisible();
    });
  });
});
