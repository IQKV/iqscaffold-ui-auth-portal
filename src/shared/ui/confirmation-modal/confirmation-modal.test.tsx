import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { ConfirmationModal } from "./confirmation-modal";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

describe("ConfirmationModal", () => {
  const mockOnClose = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when opened", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      </TestWrapper>
    );

    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened={false}
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      </TestWrapper>
    );

    expect(screen.queryByText("Confirm Action")).not.toBeInTheDocument();
  });

  it("displays custom title and message", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          title="Delete Item"
          message="Are you sure you want to delete this item?"
        />
      </TestWrapper>
    );

    expect(screen.getByText("Delete Item")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this item?")
    ).toBeInTheDocument();
  });

  it("displays custom button labels", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          confirmLabel="Delete"
          cancelLabel="Keep"
        />
      </TestWrapper>
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Keep")).toBeInTheDocument();
  });

  it("calls onConfirm when confirm button clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      </TestWrapper>
    );

    const confirmButton = screen.getByText("Confirm");
    await user.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when cancel button clicked", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
        />
      </TestWrapper>
    );

    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows danger styling when danger prop is true", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          danger
        />
      </TestWrapper>
    );

    // Danger icon should be present
    const icon = document.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("disables buttons when loading", () => {
    render(
      <TestWrapper>
        <ConfirmationModal
          opened
          onClose={mockOnClose}
          onConfirm={mockOnConfirm}
          loading
        />
      </TestWrapper>
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const confirmButton = screen.getByRole("button", { name: "Confirm" });

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });
});
