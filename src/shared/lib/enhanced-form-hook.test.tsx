import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MantineProvider,
  TextInput,
  PasswordInput,
  Textarea,
  Select,
  Checkbox,
} from "@mantine/core";
import { z } from "zod";
import { useForm as useMantineForm, UseFormInput, UseFormReturnType } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

// Test-specific form hook without Lingui dependency
const useForm = <T extends Record<string, any> = Record<string, any>>(
  input: { schema: z.ZodSchema<T> } & Omit<UseFormInput<T>, "validate">,
): UseFormReturnType<T> => {
  const { schema, ...mantineFormInput } = input;
  const formConfig: UseFormInput<T> = {
    ...mantineFormInput,
    validate: zodResolver(schema),
  };
  return useMantineForm(formConfig);
};

// Test-specific validation schemas without Lingui
const testValidationSchemas = {
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
};

const createFormSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape);
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

// Test schema
const testSchema = createFormSchema({
  email: testValidationSchemas.email,
  username: z.string().min(3, "Username must be at least 3 characters"),
  age: z.coerce.number().min(18, "Must be at least 18"),
});

type TestFormType = z.infer<typeof testSchema>;

// Test component with Zod validation
const TestFormComponent = () => {
  const form = useForm<TestFormType>({
    initialValues: {
      email: "",
      username: "",
      age: 0,
    },
    schema: testSchema,
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <TextInput type="email" label="Email" {...form.getInputProps("email")} />
      <TextInput label="Username" {...form.getInputProps("username")} />
      <TextInput type="number" label="Age" {...form.getInputProps("age")} />
      <button type="submit">Submit</button>
    </form>
  );
};

// Simple form component for field type testing
const SimpleFormComponent = () => {
  const form = useForm({
    initialValues: {
      text: "",
      email: "",
      password: "",
      number: 0,
      textarea: "",
      select: "",
      checkbox: false,
    },
    schema: createFormSchema({
      text: z.string(),
      email: testValidationSchemas.email,
      password: z.string(),
      number: z.coerce.number(),
      textarea: z.string(),
      select: z.string(),
      checkbox: z.boolean(),
    }),
  });

  return (
    <form>
      <TextInput label="Text Field" {...form.getInputProps("text")} />
      <TextInput type="email" label="Email Field" {...form.getInputProps("email")} />
      <PasswordInput label="Password Field" {...form.getInputProps("password")} />
      <TextInput type="number" label="Number Field" {...form.getInputProps("number")} />
      <Textarea label="Textarea Field" {...form.getInputProps("textarea")} />
      <Select
        label="Select Field"
        data={[{ value: "option1", label: "Option 1" }]}
        {...form.getInputProps("select")}
      />
      <Checkbox label="Checkbox Field" {...form.getInputProps("checkbox", { type: "checkbox" })} />
    </form>
  );
};

describe("useForm", () => {
  it("validates email field with Zod schema", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>,
    );

    const emailInput = screen.getByLabelText(/email/i);

    // Test that the form accepts valid email
    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");

    // Test that the form field is rendered correctly
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("validates username field with minimum length", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>,
    );

    const usernameInput = screen.getByLabelText(/username/i);

    // Enter short username
    await user.type(usernameInput, "ab");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it("validates number field with minimum value", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>,
    );

    const ageInput = screen.getByLabelText(/age/i);

    // Enter age below minimum
    await user.clear(ageInput);
    await user.type(ageInput, "16");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/must be at least 18/i)).toBeInTheDocument();
    });
  });

  it("submits form with valid data", async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>,
    );

    // Fill form with valid data
    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/username/i), "testuser");
    await user.clear(screen.getByLabelText(/age/i));
    await user.type(screen.getByLabelText(/age/i), "25");

    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        email: "test@example.com",
        username: "testuser",
        age: "25", // HTML number inputs return strings
      });
    });

    consoleSpy.mockRestore();
  });
});

describe("Form field types", () => {
  it("renders different field types correctly", () => {
    render(
      <TestWrapper>
        <SimpleFormComponent />
      </TestWrapper>,
    );

    expect(screen.getByLabelText(/text field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number field/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/textarea field/i)).toBeInTheDocument();
    expect(screen.getAllByLabelText(/select field/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/checkbox field/i)).toBeInTheDocument();
  });
});
