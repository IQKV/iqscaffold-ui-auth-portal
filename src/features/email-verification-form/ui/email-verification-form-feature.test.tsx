import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { EmailVerificationFormFeature } from "./email-verification-form-feature";
import { authApi } from "@/shared/api";

// Mock the auth API
vi.mock("@/shared/api", () => ({
  authApi: {
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
  },
}));

// Mock the router
const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
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

describe("EmailVerificationFormFeature", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSearch.mockReturnValue({});
  });

  describe("Resend Verification Mode (no token)", () => {
    it("renders resend verification form when no token provided", () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      expect(
        screen.getByPlaceholderText("Enter your email address")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Send Verification Email" })
      ).toBeInTheDocument();
      expect(screen.getByText("Back to Sign In")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Enter your email address and we'll send you a new verification link."
        )
      ).toBeInTheDocument();
    });

    it("shows validation error for invalid email", async () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const submitButton = screen.getByRole("button", {
        name: "Send Verification Email",
      });

      await user.type(emailInput, "invalid-email");
      await user.click(submitButton);

      // Check that the form is still visible (not submitted)
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });

      // Check that the API was not called due to validation error
      expect(authApi.resendVerification).not.toHaveBeenCalled();
    });

    it("submits resend verification with valid email", async () => {
      vi.mocked(authApi.resendVerification).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const submitButton = screen.getByRole("button", {
        name: "Send Verification Email",
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(authApi.resendVerification).toHaveBeenCalledWith(
          "test@example.com"
        );
      });
    });

    it("shows loading state during resend submission", async () => {
      // Mock a delayed response
      vi.mocked(authApi.resendVerification).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const submitButton = screen.getByRole("button", {
        name: "Send Verification Email",
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      // Check for loading state
      expect(submitButton).toBeDisabled();
    });

    it("calls onResendSuccess callback when provided", async () => {
      const onResendSuccess = vi.fn();
      vi.mocked(authApi.resendVerification).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature onResendSuccess={onResendSuccess} />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const submitButton = screen.getByRole("button", {
        name: "Send Verification Email",
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(onResendSuccess).toHaveBeenCalledWith("test@example.com");
      });
    });

    it("handles resend API errors gracefully", async () => {
      const errorMessage = "Network error";
      vi.mocked(authApi.resendVerification).mockRejectedValue(
        new Error(errorMessage)
      );

      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      const submitButton = screen.getByRole("button", {
        name: "Send Verification Email",
      });

      await user.type(emailInput, "test@example.com");
      await user.click(submitButton);

      await waitFor(() => {
        expect(authApi.resendVerification).toHaveBeenCalledWith(
          "test@example.com"
        );
      });

      // Form should be re-enabled after error
      await waitFor(() => {
        expect(submitButton).toBeEnabled();
      });
    });

    it("pre-fills email from props", () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature email="prefilled@example.com" />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      expect(emailInput).toHaveValue("prefilled@example.com");
    });

    it("pre-fills email from URL search params", () => {
      mockUseSearch.mockReturnValue({ email: "url@example.com" });

      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );
      expect(emailInput).toHaveValue("url@example.com");
    });
  });

  describe("Email Verification Mode (with token)", () => {
    it("shows verification pending state initially", () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="valid-token" />
        </TestWrapper>
      );

      expect(screen.getByText("Verifying Your Email...")).toBeInTheDocument();
      expect(
        screen.getByText("Please wait while we verify your email address.")
      ).toBeInTheDocument();
    });

    it("automatically calls verifyEmail when token is provided", async () => {
      vi.mocked(authApi.verifyEmail).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="valid-token" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(authApi.verifyEmail).toHaveBeenCalledWith("valid-token");
      });
    });

    it("shows success state after successful verification", async () => {
      vi.mocked(authApi.verifyEmail).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="valid-token" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Email Verified!")).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "Your email has been successfully verified. You will be redirected to the login page shortly."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Continue to Sign In" })
      ).toBeInTheDocument();
    });

    it("shows error state after failed verification", async () => {
      vi.mocked(authApi.verifyEmail).mockRejectedValue(
        new Error("Invalid token")
      );

      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="invalid-token" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Verification Failed")).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          "The verification link is invalid or has expired. You can request a new verification email below."
        )
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Back to Sign In" })
      ).toBeInTheDocument();
    });

    it("calls onVerificationSuccess callback when provided", async () => {
      const onVerificationSuccess = vi.fn();
      vi.mocked(authApi.verifyEmail).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature
            token="valid-token"
            onVerificationSuccess={onVerificationSuccess}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(onVerificationSuccess).toHaveBeenCalled();
      });
    });

    it("navigates to login after successful verification when no callback provided", async () => {
      vi.mocked(authApi.verifyEmail).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="valid-token" />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(authApi.verifyEmail).toHaveBeenCalledWith("valid-token");
      });

      // Wait for the timeout to trigger navigation
      await new Promise((resolve) => setTimeout(resolve, 2100));

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("uses token from props over search params", () => {
      mockUseSearch.mockReturnValue({ token: "search-token" });

      vi.mocked(authApi.verifyEmail).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature token="prop-token" />
        </TestWrapper>
      );

      // Should show verification UI (not resend form)
      expect(screen.getByText("Verifying Your Email...")).toBeInTheDocument();
      expect(
        screen.queryByText("Send Verification Email")
      ).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("calls onBackToLogin callback when back button is clicked in resend mode", async () => {
      const onBackToLogin = vi.fn();

      render(
        <TestWrapper>
          <EmailVerificationFormFeature onBackToLogin={onBackToLogin} />
        </TestWrapper>
      );

      const backButton = screen.getByText("Back to Sign In");
      await user.click(backButton);

      expect(onBackToLogin).toHaveBeenCalled();
    });

    it("navigates to login when back button is clicked and no callback provided", async () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const backButton = screen.getByText("Back to Sign In");
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/login" });
    });

    it("calls onBackToLogin callback when back button is clicked in error state", async () => {
      const onBackToLogin = vi.fn();
      vi.mocked(authApi.verifyEmail).mockRejectedValue(
        new Error("Invalid token")
      );

      render(
        <TestWrapper>
          <EmailVerificationFormFeature
            token="invalid-token"
            onBackToLogin={onBackToLogin}
          />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByText("Verification Failed")).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", {
        name: "Back to Sign In",
      });
      await user.click(backButton);

      expect(onBackToLogin).toHaveBeenCalled();
    });
  });

  describe("Keyboard Navigation", () => {
    it("allows keyboard navigation in resend mode", async () => {
      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );

      // Focus email field
      emailInput.focus();
      expect(emailInput).toHaveFocus();

      // Tab to submit button
      await user.tab();
      expect(
        screen.getByRole("button", { name: "Send Verification Email" })
      ).toHaveFocus();
    });

    it("submits resend form with Enter key", async () => {
      vi.mocked(authApi.resendVerification).mockResolvedValue(undefined);

      render(
        <TestWrapper>
          <EmailVerificationFormFeature />
        </TestWrapper>
      );

      const emailInput = screen.getByPlaceholderText(
        "Enter your email address"
      );

      await user.type(emailInput, "test@example.com");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(authApi.resendVerification).toHaveBeenCalledWith(
          "test@example.com"
        );
      });
    });
  });
});
