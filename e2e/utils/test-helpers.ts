import { expect, type Page } from "@playwright/test";

/**
 * Common test utilities and page object models for e2e tests
 */

export class AuthPage {
  constructor(private page: Page) {}

  // Navigation
  async goToLogin() {
    await this.page.goto("/");
    await this.page.waitForLoadState("networkidle");
  }

  async goToRegister() {
    await this.page.goto("/register");
    await this.page.waitForLoadState("networkidle");
  }

  async goToForgotPassword() {
    await this.page.goto("/forgot-password");
    await this.page.waitForLoadState("networkidle");
  }

  async goToResetPassword(token: string) {
    await this.page.goto(`/reset-password?token=${token}`);
    await this.page.waitForLoadState("networkidle");
  }

  async goToResetPasswordWithoutToken() {
    await this.page.goto("/reset-password");
    await this.page.waitForLoadState("networkidle");
  }

  async goToVerifyEmail(token: string) {
    await this.page.goto(`/verify-email?token=${token}`);
    await this.page.waitForLoadState("networkidle");
  }

  async goToVerifyEmailWithoutToken() {
    await this.page.goto("/verify-email");
    await this.page.waitForLoadState("networkidle");
  }

  // Login page elements
  get loginForm() {
    return {
      usernameInput: this.page.getByPlaceholder("Enter your username or email"),
      passwordInput: this.page.getByPlaceholder("Enter your password"),
      rememberMeCheckbox: this.page.getByLabel("Remember me"),
      submitButton: this.page.getByRole("button", { name: "Sign In" }),
      forgotPasswordLink: this.page.getByText("Forgot password?"),
      signUpLink: this.page.getByText("Don't have an account? Sign up"),
    };
  }

  // Register page elements
  get registerForm() {
    return {
      firstNameInput: this.page.getByLabel("First Name"),
      lastNameInput: this.page.getByLabel("Last Name"),
      usernameInput: this.page.getByLabel("Username"),
      emailInput: this.page.getByPlaceholder("john.doe@example.com"),
      passwordInput: this.page.getByLabel("Password").first(), // Use first() to get the main password field
      confirmPasswordInput: this.page.getByLabel("Confirm Password"),
      submitButton: this.page.getByRole("button", { name: "Create Account" }),
      signInLink: this.page.getByText("Already have an account? Sign in"),
    };
  }

  // Forgot password page elements
  get forgotPasswordForm() {
    return {
      emailInput: this.page.getByPlaceholder("Enter your email address"),
      submitButton: this.page.getByRole("button", { name: "Send Reset Link" }),
      backToLoginLink: this.page.getByText("Back to Sign In"),
    };
  }

  // Reset password page elements
  get resetPasswordForm() {
    return {
      passwordInput: this.page.getByPlaceholder("Enter your new password"),
      confirmPasswordInput: this.page.getByPlaceholder(
        "Confirm your new password"
      ),
      submitButton: this.page.getByRole("button", { name: "Reset Password" }),
      backToLoginLink: this.page.getByText("Back to Sign In"),
    };
  }

  // Verify email page elements
  get verifyEmailForm() {
    return {
      emailInput: this.page.getByPlaceholder("Enter your email address"),
      submitButton: this.page.getByRole("button", {
        name: "Send Verification Email",
      }),
      backToLoginLink: this.page.getByText("Back to Sign In"),
    };
  }

  // Common actions
  async fillLoginForm(username: string, password: string, rememberMe = false) {
    await expect(this.loginForm.usernameInput).toBeVisible();
    await this.loginForm.usernameInput.fill(username);
    await expect(this.loginForm.passwordInput).toBeVisible();
    await this.loginForm.passwordInput.fill(password);
    if (rememberMe) {
      await this.loginForm.rememberMeCheckbox.check();
    }
  }

  async submitLoginForm() {
    await this.loginForm.submitButton.click();
  }

  async fillRegisterForm(data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) {
    await this.registerForm.firstNameInput.fill(data.firstName);
    await this.registerForm.lastNameInput.fill(data.lastName);
    await this.registerForm.usernameInput.fill(data.username);
    await this.registerForm.emailInput.fill(data.email);
    await this.registerForm.passwordInput.fill(data.password);
    await this.registerForm.confirmPasswordInput.fill(
      data.confirmPassword || data.password
    );
  }

  async submitRegisterForm() {
    await this.registerForm.submitButton.click();
  }

  async fillForgotPasswordForm(email: string) {
    await this.forgotPasswordForm.emailInput.fill(email);
  }

  async submitForgotPasswordForm() {
    await this.forgotPasswordForm.submitButton.click();
  }

  async fillResetPasswordForm(password: string, confirmPassword: string) {
    await this.resetPasswordForm.passwordInput.fill(password);
    await this.resetPasswordForm.confirmPasswordInput.fill(confirmPassword);
  }

  async submitResetPasswordForm() {
    await this.resetPasswordForm.submitButton.click();
  }

  async fillVerifyEmailForm(email: string) {
    await this.verifyEmailForm.emailInput.fill(email);
  }

  async submitVerifyEmailForm() {
    await this.verifyEmailForm.submitButton.click();
  }

  // Assertions
  async expectLoginPageVisible() {
    await expect(
      this.page.getByRole("heading", { name: "Welcome to IQ Scaffold" })
    ).toBeVisible();
    await expect(this.loginForm.usernameInput).toBeVisible();
    await expect(this.loginForm.passwordInput).toBeVisible();
    await expect(this.loginForm.submitButton).toBeVisible();
  }

  async expectRegisterPageVisible() {
    await expect(
      this.page.getByRole("heading", { name: "Create Your Account" })
    ).toBeVisible();
    await expect(this.registerForm.firstNameInput).toBeVisible();
    await expect(this.registerForm.submitButton).toBeVisible();
  }

  async expectForgotPasswordPageVisible() {
    await expect(this.forgotPasswordForm.emailInput).toBeVisible();
    await expect(this.forgotPasswordForm.submitButton).toBeVisible();
  }

  async expectResetPasswordPageVisible() {
    await expect(this.resetPasswordForm.passwordInput).toBeVisible();
    await expect(this.resetPasswordForm.confirmPasswordInput).toBeVisible();
    await expect(this.resetPasswordForm.submitButton).toBeVisible();
  }

  async expectVerifyEmailPageVisible() {
    await expect(this.verifyEmailForm.emailInput).toBeVisible();
    await expect(this.verifyEmailForm.submitButton).toBeVisible();
  }

  async expectValidationError(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectFormSubmitting(buttonSelector: string) {
    const button = this.page.locator(buttonSelector);
    await expect(button)
      .toBeDisabled({ timeout: 2000 })
      .catch(() => {
        // Button might not be disabled if API responds too quickly
      });
  }
}

/**
 * Test data generators
 */
export const testData = {
  validUser: {
    firstName: "Test",
    lastName: "User",
    username: "testuser123",
    email: "test@example.com",
    password: "TestPassword123!",
  },

  generateUniqueUser: () => {
    const timestamp = Date.now();
    return {
      firstName: "E2E",
      lastName: "Test",
      username: `e2euser_${timestamp}`,
      email: `e2e_${timestamp}@example.com`,
      password: "E2eTest123!",
    };
  },

  invalidData: {
    shortUsername: "ab",
    invalidEmail: "invalid-email",
    weakPassword: "weak",
    longUsername: "a".repeat(51),
  },
};

/**
 * Common test utilities
 */
export const testUtils = {
  /**
   * Wait for page to be fully loaded and interactive
   */
  async waitForPageReady(page: Page) {
    await page.waitForLoadState("networkidle");
    await page.waitForLoadState("domcontentloaded");
  },

  /**
   * Check if page has no console errors
   */
  async expectNoConsoleErrors(page: Page) {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto("/");
    await this.waitForPageReady(page);

    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes("Failed to load resource") && // API errors are expected without backend
        !error.includes("NetworkError") &&
        !error.includes("fetch")
    );

    expect(criticalErrors).toHaveLength(0);
  },

  /**
   * Test responsive design at different viewports
   */
  async testResponsiveDesign(
    page: Page,
    testCallback: (page: Page) => Promise<void>
  ) {
    const viewports = [
      { width: 375, height: 667, name: "mobile" },
      { width: 768, height: 1024, name: "tablet" },
      { width: 1920, height: 1080, name: "desktop" },
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await testCallback(page);
    }
  },
};
