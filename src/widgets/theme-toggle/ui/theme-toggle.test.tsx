import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { ThemeToggle } from "./theme-toggle";

// Mock useMantineColorScheme
const mockToggleColorScheme = vi.fn();
vi.mock("@mantine/core", async () => {
  const actual = await vi.importActual("@mantine/core");
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: "light",
      toggleColorScheme: mockToggleColorScheme,
    }),
  };
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("ThemeToggle", () => {
  it("renders theme toggle button", () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByTestId("theme-toggle-button");
    expect(button).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByLabelText("Toggle color scheme");
    expect(button).toBeInTheDocument();
  });

  it("calls toggleColorScheme when clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByTestId("theme-toggle-button");
    await user.click(button);

    expect(mockToggleColorScheme).toHaveBeenCalled();
  });

  it("renders as an ActionIcon", () => {
    render(
      <TestWrapper>
        <ThemeToggle />
      </TestWrapper>
    );

    const button = screen.getByTestId("theme-toggle-button");
    expect(button.tagName).toBe("BUTTON");
  });
});
