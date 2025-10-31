import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ForgotPasswordFormFeature } from "./forgot-password-form-feature";
import { authApi } from "@/shared/api";

// Mock the auth API
vi.mock("@/shared/api", () => ({
  authApi: {
    forgotPassword: vi.fn(),
  },
}));

// Mock the router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <Notifications />
        {children}
      </QueryClientProvider>
    </MantineProvider>
  );
};

describe("ForgotPasswordFormFeature", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form elements correctly", () => {
    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    expect(
      screen.getByPlaceholderText("Enter your email address")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toBeInTheDocument();
    expect(screen.getByText("Back to Sign In")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your email address and we'll send you a link to reset your password."
      )
    ).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });
    await user.click(submitButton);

    // Check that the form is still visible (not submitted)
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // Check that the API was not called due to validation error
    expect(authApi.forgotPassword).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email format", async () => {
    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    // Check that the API was not called due to validation error
    await waitFor(() => {
      expect(authApi.forgotPassword).not.toHaveBeenCalled();
    });

    // Check that the form is still visible (not submitted)
    expect(submitButton).toBeEnabled();
  });

  it("submits form with valid email", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.forgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("shows loading state during submission", async () => {
    // Mock a delayed response
    vi.mocked(authApi.forgotPassword).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    // Check for loading state
    expect(submitButton).toBeDisabled();
  });

  it("calls onSuccess callback when provided", async () => {
    const onSuccess = vi.fn();
    vi.mocked(authApi.forgotPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature onSuccess={onSuccess} />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("navigates to login page on successful submission when no callback provided", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });
  });

  it("calls onBackToLogin callback when back button is clicked", async () => {
    const onBackToLogin = vi.fn();

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature onBackToLogin={onBackToLogin} />
      </TestWrapper>
    );

    const backButton = screen.getByText("Back to Sign In");
    await user.click(backButton);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("navigates to login page when back button is clicked and no callback provided", async () => {
    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const backButton = screen.getByText("Back to Sign In");
    await user.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
  });

  it("handles API errors gracefully", async () => {
    const errorMessage = "Network error";
    vi.mocked(authApi.forgotPassword).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByRole("button", {
      name: "Send Reset Link",
    });

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(authApi.forgotPassword).toHaveBeenCalledWith("test@example.com");
    });

    // Form should be re-enabled after error
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("allows keyboard navigation", async () => {
    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");

    // Focus email field
    emailInput.focus();
    expect(emailInput).toHaveFocus();

    // Tab to submit button
    await user.tab();
    expect(
      screen.getByRole("button", { name: "Send Reset Link" })
    ).toHaveFocus();
  });

  it("submits form with Enter key", async () => {
    vi.mocked(authApi.forgotPassword).mockResolvedValue(undefined);

    render(
      <TestWrapper>
        <ForgotPasswordFormFeature />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText("Enter your email address");

    await user.type(emailInput, "test@example.com");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(authApi.forgotPassword).toHaveBeenCalledWith("test@example.com");
    });
  });
});
