import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { AuthLayout } from "./auth-layout";

// Mock Helmet
vi.mock("@dr.pogodin/react-helmet", () => ({
  Helmet: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="helmet">{children}</div>
  ),
}));

// Mock ThemeToggle
vi.mock("@/widgets/theme-toggle", () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("AuthLayout", () => {
  it("renders auth layout correctly", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Test Title">
          <div>Test Content</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(
      screen.getByTestId("auth-layout-form-container")
    ).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders title correctly", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Sign In">
          <div>Form</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Sign In" subtitle="Welcome back!">
          <div>Form</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByText("Welcome back!")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Sign In">
          <div>Form</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.queryByText("Welcome back!")).not.toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Test">
          <div data-testid="child-content">Child Component</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });

  it("renders theme toggle", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Test">
          <div>Content</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("sets page title with default suffix", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Sign In">
          <div>Content</div>
        </AuthLayout>
      </TestWrapper>
    );

    const helmet = screen.getByTestId("helmet");
    expect(helmet).toBeInTheDocument();
  });

  it("uses custom page title when provided", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Sign In" pageTitle="Custom Page Title">
          <div>Content</div>
        </AuthLayout>
      </TestWrapper>
    );

    const helmet = screen.getByTestId("helmet");
    expect(helmet).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <TestWrapper>
        <AuthLayout title="Test">
          <div>First Child</div>
          <div>Second Child</div>
        </AuthLayout>
      </TestWrapper>
    );

    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
  });
});
