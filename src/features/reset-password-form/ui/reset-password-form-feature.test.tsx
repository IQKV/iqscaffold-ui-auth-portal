import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ResetPasswordFormFeature } from "./reset-password-form-feature";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
  useSearch: () => ({ token: "valid-token" }),
}));

vi.mock("@/shared/lib/use-auth-api", () => ({
  useResetPassword: vi.fn(),
  useValidateResetToken: vi.fn(),
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
  let useResetPassword: any;
  let useValidateResetToken: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const authApi = await import("@/shared/lib/use-auth-api");
    useResetPassword = authApi.useResetPassword;
    useValidateResetToken = authApi.useValidateResetToken;

    useResetPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
    });

    useValidateResetToken.mockReturnValue({
      data: true,
      isLoading: false,
    });
  });

  it("shows loading state while validating token", () => {
    useValidateResetToken.mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("reset-password-loading")).toBeInTheDocument();
  });

  it("shows error when token is invalid", () => {
    useValidateResetToken.mockReturnValue({
      data: false,
      isLoading: false,
    });

    render(<ResetPasswordFormFeature token="invalid-token" />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("reset-password-invalid")).toBeInTheDocument();
  });

  it("shows error when no token provided", () => {
    useValidateResetToken.mockReturnValue({
      data: false,
      isLoading: false,
    });

    render(<ResetPasswordFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("reset-password-invalid")).toBeInTheDocument();
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

  it("displays back to login link", () => {
    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const backLink = screen.getByTestId("reset-password-link-back");
    expect(backLink).toBeInTheDocument();
  });

  it("submits form with valid passwords", async () => {
    const user = userEvent.setup();

    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const passwordInput = screen.getByTestId("reset-password-input-password");
    const confirmPasswordInput = screen.getByTestId(
      "reset-password-input-confirm-password"
    );
    const submitButton = screen.getByTestId("reset-password-button-submit");

    await user.type(passwordInput, "NewPassword123!");
    await user.type(confirmPasswordInput, "NewPassword123!");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        token: "valid-token",
        newPassword: "NewPassword123!",
      });
    });
  });

  it("calls onSuccess callback when mutation succeeds", async () => {
    const onSuccess = vi.fn();

    useResetPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: true,
    });

    render(
      <ResetPasswordFormFeature token="valid-token" onSuccess={onSuccess} />,
      {
        wrapper: createWrapper(),
      }
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("calls onBackToLogin callback when link clicked", async () => {
    const user = userEvent.setup();
    const onBackToLogin = vi.fn();

    render(
      <ResetPasswordFormFeature
        token="valid-token"
        onBackToLogin={onBackToLogin}
      />,
      {
        wrapper: createWrapper(),
      }
    );

    const backLink = screen.getByTestId("reset-password-link-back");
    await user.click(backLink);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("shows loading state during submission", () => {
    useResetPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
    });

    render(<ResetPasswordFormFeature token="valid-token" />, {
      wrapper: createWrapper(),
    });

    const submitButton = screen.getByTestId("reset-password-button-submit");
    expect(submitButton).toBeDisabled();
  });
});
