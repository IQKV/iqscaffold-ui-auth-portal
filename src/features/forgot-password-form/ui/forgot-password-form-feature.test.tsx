import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { ForgotPasswordFormFeature } from "./forgot-password-form-feature";

// Mock dependencies
vi.mock("@/shared/lib/use-auth-api", () => ({
  // No imports used from here in this file anymore, or keep if needed?
  // Actually the component imports authApi from shared/api, not use-auth-api
}));

vi.mock("@/shared/lib/use-form-mutation", () => ({
  useFormMutation: vi.fn(),
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
    const { useFormMutation } = await import("@/shared/lib/use-form-mutation");
    (useFormMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isSuccess: false,
    });
  });

  it("renders forgot password form correctly", () => {
    render(<ForgotPasswordFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("forgot-password-form")).toBeInTheDocument();
    expect(
      screen.getByTestId("forgot-password-input-email")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("forgot-password-button-submit")
    ).toBeInTheDocument();
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
      expect(mockMutate).toHaveBeenCalledWith("test@example.com");
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
    const { useFormMutation } = await import("@/shared/lib/use-form-mutation");
    (useFormMutation as any).mockReturnValue({
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

    const { useFormMutation } = await import("@/shared/lib/use-form-mutation");
    // Simulate onSuccess callback execution which is handled by mutation options in component
    // But since we mock useFormMutation, we need to simulate the onSuccess behavior or trigger it manually?
    // The component passes options to useFormMutation.
    // If we mock useFormMutation to return isSuccess: true, the component MIGHT rely on isSuccess prop (old way) OR onSuccess callback (new way).
    // In refactored component: "onSuccess: () => { ... }" is in options.
    // The old component used useEffect on isSuccess.
    // The NEW component uses `onSuccess` callback in mutation options.
    // To test this with mocked useFormMutation, we should capture the options passed to it and call onSuccess?
    // Or simpler: The test checks if `onSuccess` prop of the FEATURE is called.
    // If we mock `mutate` to call the onSuccess option?
    // Let's adjust the mock to capture options.

    // For now, let's keep simple replacement to fix import error.
    // However, since we refactored logic to NOT use useEffect but mutation callback,
    // merely setting isSuccess: true might NOT trigger the callback if the mock doesn't execute options.onSuccess.
    // But wait, the test says "calls onSuccess callback after successful submission".
    // In the previous implementation, it relied on `isSuccess` state.
    // In the NEW implementation, `useFormMutation` calls `onSuccess` from options.
    // So masking `useFormMutation` needs to be smart enough or we need to update test strategy.

    // Strategy: Mock useFormMutationImplementation to call options.onSuccess immediately or on mutate.
    (useFormMutation as any).mockImplementation((form: any, mutationFn: any, options: any) => ({
      mutate: (vars: any) => {
        mockMutate(vars);
        options.onSuccess?.(null, vars, null);
      },
      isPending: false,
      isSuccess: true,
    }));

    render(<ForgotPasswordFormFeature onSuccess={onSuccess} />, {
      wrapper: createWrapper(),
    });

    const emailInput = screen.getByPlaceholderText("Enter your email address");

    await user.type(emailInput, "test@example.com");

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith("test@example.com");
    });
  });
});
