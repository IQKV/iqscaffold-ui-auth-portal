import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { useForm as useMantineForm } from "@mantine/form";
import { FormField } from "./form-field";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

const FormFieldTestComponent = ({ type, ...props }: any) => {
  const form = useMantineForm({
    initialValues: { testField: "" },
  });

  return (
    <FormField
      name="testField"
      label="Test Field"
      form={form}
      type={type}
      {...props}
    />
  );
};

describe("FormField", () => {
  describe("text input", () => {
    it("renders text input correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent type="text" placeholder="Enter text" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("Enter text");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "text");
    });

    it("handles user input", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <FormFieldTestComponent type="text" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("");
      await user.type(input, "test value");

      expect(input).toHaveValue("test value");
    });
  });

  describe("email input", () => {
    it("renders email input correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent type="email" placeholder="Enter email" />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("Enter email");
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("password input", () => {
    it("renders password input correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="password"
            placeholder="Enter password"
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("Enter password");
      expect(input).toBeInTheDocument();
    });
  });

  describe("textarea", () => {
    it("renders textarea correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="textarea"
            placeholder="Enter description"
            rows={5}
          />
        </TestWrapper>
      );

      const textarea = screen.getByPlaceholderText("Enter description");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });
  });

  describe("number input", () => {
    it("renders number input correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="number"
            placeholder="Enter number"
            min={0}
            max={100}
          />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("Enter number");
      expect(input).toBeInTheDocument();
    });
  });

  describe("select", () => {
    it("renders select correctly", () => {
      const data = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];

      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="select"
            data={data}
            placeholder="Select option"
          />
        </TestWrapper>
      );

      const select = screen.getByPlaceholderText("Select option");
      expect(select).toBeInTheDocument();
    });
  });

  describe("checkbox", () => {
    it("renders checkbox correctly", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="checkbox"
            checkboxLabel="Accept terms"
          />
        </TestWrapper>
      );

      const checkbox = screen.getByText("Accept terms");
      expect(checkbox).toBeInTheDocument();
    });

    it("handles checkbox toggle", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <FormFieldTestComponent
            type="checkbox"
            checkboxLabel="Accept terms"
          />
        </TestWrapper>
      );

      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("radio", () => {
    it("renders radio group correctly", () => {
      const data = [
        { value: "1", label: "Option 1" },
        { value: "2", label: "Option 2" },
      ];

      render(
        <TestWrapper>
          <FormFieldTestComponent type="radio" data={data} />
        </TestWrapper>
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("displays error message", () => {
      const ValidationTestComponent = () => {
        const form = useMantineForm({
          initialValues: { testField: "" },
        });
        form.setFieldError("testField", "This field is required");

        return (
          <FormField
            name="testField"
            label="Test Field"
            form={form}
            type="text"
          />
        );
      };

      render(
        <TestWrapper>
          <ValidationTestComponent />
        </TestWrapper>
      );

      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables input when disabled prop is true", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent type="text" disabled />
        </TestWrapper>
      );

      const input = screen.getByPlaceholderText("");
      expect(input).toBeDisabled();
    });
  });

  describe("required indicator", () => {
    it("shows asterisk when withAsterisk is true", () => {
      render(
        <TestWrapper>
          <FormFieldTestComponent type="text" withAsterisk />
        </TestWrapper>
      );

      expect(screen.getByText("*")).toBeInTheDocument();
    });
  });
});
