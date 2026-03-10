import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { SignInFormFeature } from "./signin-form-feature";
import { useAuthStore } from "@/processes/auth";

// Mock dependencies
vi.mock("@/processes/auth", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("@/app/config", () => ({
  getAuthConfig: () => ({
    redirects: {
      afterLogin: "https://app.example.com",
    },
  }),
  getFinalMSWConfig: () => ({
    enabled: false,
    handlers: [],
  }),
  getConfig: (key: string) => {
    if (key === "VITE_API_SERVER_URL") {
      return "https://api.example.com";
    }
    return "";
  },
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

describe("SignInFormFeature", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        login: mockLogin,
        isLoading: false,
      };
      return selector(state);
    });
  });

  it("renders signin form correctly", () => {
    render(<SignInFormFeature />, { wrapper: createWrapper() });

    expect(screen.getByTestId("signin-form")).toBeInTheDocument();
    expect(screen.getByTestId("signin-input-username")).toBeInTheDocument();
    expect(screen.getByTestId("signin-input-password")).toBeInTheDocument();
    expect(screen.getByTestId("signin-button-submit")).toBeInTheDocument();
  });

  it("handles user input correctly", async () => {
    const user = userEvent.setup();
    render(<SignInFormFeature />, { wrapper: createWrapper() });

    const usernameInput = screen.getByPlaceholderText("Enter your username or email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    expect(usernameInput).toHaveValue("testuser");
    expect(passwordInput).toHaveValue("password123");
  });

  it("submits form with valid credentials", async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue(undefined);

    render(<SignInFormFeature />, { wrapper: createWrapper() });

    const usernameInput = screen.getByPlaceholderText("Enter your username or email");
    const passwordInput = screen.getByPlaceholderText("Enter your password");
    const submitButton = screen.getByTestId("signin-button-submit");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
        tenantId: "default",
        rememberMe: false,
      });
    });
  });

  it("displays forgot password link", () => {
    render(<SignInFormFeature />, { wrapper: createWrapper() });

    const forgotPasswordLink = screen.getByTestId("signin-link-forgot-password");
    expect(forgotPasswordLink).toBeInTheDocument();
  });

  it("displays register link", () => {
    render(<SignInFormFeature />, { wrapper: createWrapper() });

    const registerLink = screen.getByTestId("signin-link-register");
    expect(registerLink).toBeInTheDocument();
  });

  it("calls onForgotPassword callback when provided", async () => {
    const user = userEvent.setup();
    const onForgotPassword = vi.fn();

    render(<SignInFormFeature onForgotPassword={onForgotPassword} />, {
      wrapper: createWrapper(),
    });

    const forgotPasswordLink = screen.getByTestId("signin-link-forgot-password");
    await user.click(forgotPasswordLink);

    expect(onForgotPassword).toHaveBeenCalled();
  });

  it("calls onNavigateToRegister callback when provided", async () => {
    const user = userEvent.setup();
    const onNavigateToRegister = vi.fn();

    render(<SignInFormFeature onNavigateToRegister={onNavigateToRegister} />, {
      wrapper: createWrapper(),
    });

    const registerLink = screen.getByTestId("signin-link-register");
    await user.click(registerLink);

    expect(onNavigateToRegister).toHaveBeenCalled();
  });

  it("shows loading state during submission", async () => {
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        login: mockLogin,
        isLoading: true,
      };
      return selector(state);
    });

    render(<SignInFormFeature />, { wrapper: createWrapper() });

    const submitButton = screen.getByTestId("signin-button-submit");
    expect(submitButton).toHaveAttribute("data-loading", "true");
  });
});
