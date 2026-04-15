/**
 * Test configuration and constants
 */

export const TEST_CONFIG = {
  // Timeouts
  DEFAULT_TIMEOUT: 10_000,
  NAVIGATION_TIMEOUT: 15_000,
  API_TIMEOUT: 30_000,

  // Retry configuration
  MAX_RETRIES: 2,

  // Viewport sizes for responsive testing
  VIEWPORTS: {
    mobile: { width: 375, height: 667 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1920, height: 1080 },
  },

  // Test data
  VALID_USER: {
    firstName: "Test",
    lastName: "User",
    username: "testuser123",
    email: "test@example.com",
    password: "TestPassword123!",
  },

  INVALID_DATA: {
    shortUsername: "ab",
    longUsername: "a".repeat(51),
    invalidEmail: "invalid-email",
    weakPassword: "weak",
  },

  // Expected validation messages (update these based on your actual app)
  VALIDATION_MESSAGES: {
    REQUIRED_FIELD: /required/i,
    INVALID_EMAIL: /email/i,
    WEAK_PASSWORD: /password/i,
    USERNAME_LENGTH: /username/i,
    PASSWORD_MISMATCH: /password/i,
  },

  // Page titles and headings
  PAGE_TITLES: {
    LOGIN: "Welcome to IQ Key Value",
    REGISTER: "Create Your Account",
  },

  // URLs
  ROUTES: {
    LOGIN: "/",
    REGISTER: "/register",
    NOT_FOUND: "/this-page-does-not-exist",
  },
} as const;

/**
 * Generate unique test data to avoid conflicts
 */
export function generateUniqueTestData() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return {
    firstName: "E2E",
    lastName: "Test",
    username: `e2euser_${timestamp}_${random}`,
    email: `e2e_${timestamp}_${random}@example.com`,
    password: "E2eTest123!",
  };
}

/**
 * Common selectors used across tests
 */
export const SELECTORS = {
  // Forms
  FORM: "form",
  SUBMIT_BUTTON: 'button[type="submit"]',

  // Login form
  LOGIN: {
    USERNAME_INPUT: 'input[name="username"]',
    PASSWORD_INPUT: 'input[name="password"]',
    REMEMBER_ME: 'input[name="rememberMe"]',
    SUBMIT_BUTTON: 'button[type="submit"]',
    FORGOT_PASSWORD_LINK: 'a:has-text("Forgot password?")',
    SIGN_UP_LINK: 'a:has-text("Don\'t have an account? Sign up")',
  },

  // Register form
  REGISTER: {
    FIRST_NAME_INPUT: 'input[name="firstName"]',
    LAST_NAME_INPUT: 'input[name="lastName"]',
    USERNAME_INPUT: 'input[name="username"]',
    EMAIL_INPUT: 'input[name="email"]',
    PASSWORD_INPUT: 'input[name="password"]',
    CONFIRM_PASSWORD_INPUT: 'input[name="confirmPassword"]',
    SUBMIT_BUTTON: 'button[type="submit"]',
    SIGN_IN_LINK: 'a:has-text("Already have an account? Sign in")',
  },

  // Common elements
  LOADING_SPINNER: '[data-testid="loading"]',
  ERROR_MESSAGE: '[data-testid="error"]',
  SUCCESS_MESSAGE: '[data-testid="success"]',
} as const;
