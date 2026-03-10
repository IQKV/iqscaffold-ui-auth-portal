import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ForgotPasswordFormFeature } from "./forgot-password-form-feature";

// Mock dependencies
vi.mock("@/shared/lib/use-auth-api", () => ({
  useForgotPassword: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
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

  beforeEach(async () => {
    vi.clearAllMocks();
    const { useForgotPassword } = await import("@/shared/lib/use-auth-api");
    (useForgotPassword as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
    });
  });

  it("renders forgot password form correctly", () => {
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-input-email")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-button-submit")).toBeInTheDocument();
    expect(screen.getByTestId("forgot-password-link-back")).toBeInTheDocument();
  });

  it("handles email input correctly", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText("Enter your email address");

    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("submits form with valid email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByTestId("forgot-password-button-submit");

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        "test@example.com",
        expect.objectContaining({
          onSuccess: expect.any(Function),
        }),
      );
    });
  });

  it("displays back to login link", () => {
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const backLink = screen.getByTestId("forgot-password-link-back");
    expect(backLink).toBeInTheDocument();
  });

  it("calls onBackToLogin callback when provided", async () => {
    const user = userEvent.setup();
    const onBackToLogin = vi.fn();

    render(<ForgotPasswordFormFeature onBackToLogin={onBackToLogin} />, {
      wrapper: createWrapper(),
    });

    const backLink = screen.getByTestId("forgot-password-link-back");
    await user.click(backLink);

    expect(onBackToLogin).toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    const { useForgotPassword } = await import("@/shared/lib/use-auth-api");
    (useForgotPassword as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      isSuccess: false,
    });

    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    const submitButton = screen.getByTestId("forgot-password-button-submit");
    expect(submitButton).toHaveAttribute("data-loading", "true");
  });

  it("calls onSuccess callback after successful submission", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();

    const { useForgotPassword } = await import("@/shared/lib/use-auth-api");
    (useForgotPassword as any).mockImplementation(() => ({
      mutate: (email: string, options: any) => {
        mockMutate(email, options);
        options?.onSuccess?.();
      },
      isPending: false,
      isSuccess: true,
    }));

    render(<ForgotPasswordFormFeature onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    const emailInput = screen.getByPlaceholderText("Enter your email address");
    const submitButton = screen.getByTestId("forgot-password-button-submit");

    await user.type(emailInput, "test@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("test@example.com");
    });
  });
});
