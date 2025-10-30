import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MantineProvider } from "@mantine/core";
import { UsersList } from "./users-list";

// Simple test wrapper
function TestWrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <MantineProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  );
}

describe("UsersList", () => {
  it("renders users management title", () => {
    render(
      <TestWrapper>
        <UsersList />
      </TestWrapper>
    );

    expect(screen.getByText("Users Management")).toBeInTheDocument();
  });

  it("renders search input", () => {
    render(
      <TestWrapper>
        <UsersList />
      </TestWrapper>
    );

    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("renders add user button", () => {
    render(
      <TestWrapper>
        <UsersList />
      </TestWrapper>
    );

    expect(screen.getByText("Add User")).toBeInTheDocument();
  });
});
