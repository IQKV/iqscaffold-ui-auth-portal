import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ForgotPasswordFormFeature } from "./forgot-password-form-feature";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/shared/lib/use-auth-api", () => ({
  useForgotPassword: vi.fn(),
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

describe("ForgotPasswordFormFeature", () => {
  const mockMutate = vi.fn();
  let useForgotPassword: any;

  beforeEach(async () => {
    vi.clearAllMocks();
    const authApi = await import("@/shared/lib/use-auth-api");
    useForgotPassword = authApi.useForgotPassword;
    useForgotPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
    });
  });

  it("renders forgot password form", () => {
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
    expect(
      screen.getByTestId("forgot-password-input-email")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("forgot-password-button-submit")
    ).toBeInTheDocument();
  });

  it("displays back to login link", () => {
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const backLink = screen.getByTestId("forgot-password-link-back");
    expect(backLink).toBeInTheDocument();
  });

  it("submits form with valid email", async () => {
    const user = userEvent.setup();

    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId("forgot-password-input-email");
    const submitButton = screen.getByTestId("forgot-password-button-submit");

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("calls onSuccess callback when mutation succeeds", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    useForgotPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: true,
    });

    render(<ForgotPasswordFormFeature onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("");
    });
  });

  it("calls onBackToLogin callback when link clicked", async () => {
    const user = userEvent.setup();
    const onBackToLogin = vi.fn();

    render(<ForgotPasswordFormFeature onBackToLogin={onBackToLogin} />, {
      wrapper: createWrapper(),
    });

    const backLink = screen.getByTestId("forgot-password-link-back");
    await user.click(backLink);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("shows loading state during submission", () => {
    useForgotPassword.mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
    });

    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const submitButton = screen.getByTestId("forgot-password-button-submit");
    expect(submitButton).toBeDisabled();
  });
});
