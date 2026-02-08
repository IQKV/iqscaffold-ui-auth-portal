import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ResetPasswordFormFeature } from "./reset-password-form-feature";

// Mock dependencies
vi.mock("@/shared/lib/use-auth-api", () => ({
  useValidateResetToken: vi.fn(),
  useResetPassword: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ token: "valid-token" }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>{children}</MantineProvider>
    </QueryClientProvider>
  );
};

describe("ResetPasswordFormFeature", () => {
  const mockMutate = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useValidateResetToken, useResetPassword } =
      await import("@/shared/lib/use-auth-api");

    (useResetPassword as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
    });

    (useValidateResetToken as any).mockReturnValue({
      data: { valid: true },
      isLoading: false,
    });
  });

  it("renders reset password form with valid token", () => {
    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
    expect(
      screen.getByTestId("reset-password-input-password")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reset-password-input-confirm-password")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("reset-password-button-submit")
    ).toBeInTheDocument();
  });

  it("shows loading state while validating token", async () => {
    const { useValidateResetToken } = await import("@/shared/lib/use-auth-api");
    (useValidateResetToken as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("reset-password-loading")).toBeInTheDocument();
  });

  it("shows error message with invalid token", async () => {
    const { useValidateResetToken } = await import("@/shared/lib/use-auth-api");
    (useValidateResetToken as any).mockReturnValue({
      data: { valid: false },
      isLoading: false,
    });

    render(<ResetPasswordFormFeature token="invalid-token" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("reset-password-invalid")).toBeInTheDocument();
  });

  it("shows error message when no token provided", async () => {
    const { useValidateResetToken } = await import("@/shared/lib/use-auth-api");
    (useValidateResetToken as any).mockReturnValue({
      data: { valid: false },
      isLoading: false,
    });

    render(<ResetPasswordFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("reset-password-invalid")).toBeInTheDocument();
  });

  it("handles password input correctly", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );

    await user.type(passwordInput, "NewPassword123!");
    await user.type(confirmPasswordInput, "NewPassword123!");

    expect(passwordInput).toHaveValue("NewPassword123!");
    expect(confirmPasswordInput).toHaveValue("NewPassword123!");
  });

  it("submits form with valid passwords", async () => {
    const user = userEvent.setup();
    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const passwordInput = screen.getByPlaceholderText(
      "Enter your new password"
    );
    const confirmPasswordInput = screen.getByPlaceholderText(
      "Confirm your password"
    );
    const submitButton = screen.getByTestId("reset-password-button-submit");

    await user.type(passwordInput, "NewPassword123!");
    await user.type(confirmPasswordInput, "NewPassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          token: "valid-token",
          password: "NewPassword123!",
        },
        {
          onSuccess: expect.any(Function),
        }
      );
    });
  });

  it("displays back to login link", () => {
    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const backLink = screen.getByTestId("reset-password-link-back");
    expect(backLink).toBeInTheDocument();
  });

  it("calls onBackToLogin callback when provided", async () => {
    const user = userEvent.setup();
    const onBackToLogin = vi.fn();

    render(
      <ResetPasswordFormFeature
        token="valid-token"
        onBackToLogin={onBackToLogin}
      />,
      { wrapper: createWrapper() }
    );

    const backLink = screen.getByTestId("reset-password-link-back");
    await user.click(backLink);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    const { useResetPassword } = await import("@/shared/lib/use-auth-api");
    (useResetPassword as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
    });

    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByTestId("reset-password-button-submit");
    expect(submitButton).toHaveAttribute("data-loading", "true");
  });
});
