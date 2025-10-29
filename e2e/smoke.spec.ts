import { test, expect } from "@playwright/test";
import { AuthPage, testUtils } from "./utils/test-helpers";

/**
 * Smoke tests - Quick sanity checks to verify the app is working
 * These tests should be fast and cover critical paths
 */
test.describe("App Smoke Tests", () => {
  test("homepage (login page) loads successfully", async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.goToLogin();
    await expect(page).toHaveURL(/\/?$/);
    await authPage.expectLoginPageVisible();
  });

  test("register page loads successfully", async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.goToRegister();
    await expect(page).toHaveURL(/\/register$/);
    await authPage.expectRegisterPageVisible();
  });

  test("app has no critical console errors on load", async ({ page }) => {
    const consoleErrors: string[] = [];

    // Listen for console errors
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await testUtils.waitForPageReady(page);

    // Filter out expected API errors (since we don't have a backend)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("Failed to load resource") &&
        !error.includes("NetworkError") &&
        !error.includes("fetch") &&
        !error.includes("500")
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test("app has no uncaught exceptions on load", async ({ page }) => {
    const pageErrors: string[] = [];

    page.on("pageerror", (error) => {
      pageErrors.push(error.message);
    });

    await page.goto("/");
    await testUtils.waitForPageReady(page);

    expect(pageErrors).toHaveLength(0);
  });

  test("navigation between login and register works", async ({ page }) => {
    const authPage = new AuthPage(page);

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

  test("app is responsive on different viewports", async ({ page }) => {
    const authPage = new AuthPage(page);

    await testUtils.testResponsiveDesign(page, async (page) => {
      await authPage.goToLogin();
      await authPage.expectLoginPageVisible();
    });
  });

  test("app handles network errors gracefully", async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.goToLogin();

    // Simulate offline mode
    await page.context().setOffline(true);

    // Fill and submit form (should fail gracefully)
    await authPage.fillLoginForm("testuser", "password123");
    await authPage.submitLoginForm();

    // App should handle the error (not crash)
    await authPage.expectLoginPageVisible();

    // Restore network
    await page.context().setOffline(false);
  });

  test("essential meta tags are present", async ({ page }) => {
    await page.goto("/");

    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').count();
    expect(viewport).toBeGreaterThan(0);

    // Check for charset
    const hasCharset =
      (await page.locator("meta[charset]").count()) > 0 ||
      (await page.locator('meta[charset="utf-8"]').count()) > 0;
    expect(hasCharset).toBeTruthy();
  });

  test("react app renders correctly", async ({ page }) => {
    await page.goto("/");
    await testUtils.waitForPageReady(page);

    // Check if React has rendered
    const reactRoot = await page.locator("#root").count();
    expect(reactRoot).toBeGreaterThan(0);

    // Check if interactive elements work
    const authPage = new AuthPage(page);
    await expect(authPage.loginForm.submitButton).toBeEnabled();
  });
});

test.describe("Critical User Paths", () => {
  test("user can interact with login form", async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.goToLogin();
    await authPage.fillLoginForm("testuser", "password123", true);
    await authPage.submitLoginForm();

    // Form should process submission (button disabled or loading state)
    await authPage.expectFormSubmitting('button[type="submit"]');
  });

  test("user can interact with register form", async ({ page }) => {
    const authPage = new AuthPage(page);

    await authPage.goToRegister();
    await authPage.fillRegisterForm({
      firstName: "Test",
      lastName: "User",
      username: "testuser123",
      email: "test@example.com",
      password: "Password123!",
    });
    await authPage.submitRegisterForm();

    // Form should process submission
    await authPage.expectFormSubmitting('button[type="submit"]');
  });
});
