import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { z } from "zod";
import {
  useForm as useMantineForm,
  UseFormInput,
  UseFormReturnType,
} from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";

// Test-specific form hook without Lingui dependency
const useForm = <T extends Record<string, any> = Record<string, any>>(
  input: { schema: z.ZodSchema<T> } & Omit<UseFormInput<T>, "validate">
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
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
};

const createFormSchema = <T extends z.ZodRawShape>(shape: T) => {
  return z.object(shape);
};
import { EnhancedFormField } from "../ui/enhanced-form-field";

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MantineProvider>{children}</MantineProvider>
);

// Test schema
const testSchema = createFormSchema({
  email: testValidationSchemas.email,
  username: z.string().min(3, "Username must be at least 3 characters"),
  age: z.number().min(18, "Must be at least 18"),
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
      <EnhancedFormField type="email" name="email" label="Email" form={form} />
      <EnhancedFormField
        type="text"
        name="username"
        label="Username"
        form={form}
      />
      <EnhancedFormField type="number" name="age" label="Age" form={form} />
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
      number: z.number(),
      textarea: z.string(),
      select: z.string(),
      checkbox: z.boolean(),
    }),
  });

  return (
    <form>
      <EnhancedFormField type="text" name="text" label="Text" form={form} />
      <EnhancedFormField type="email" name="email" label="Email" form={form} />
      <EnhancedFormField
        type="password"
        name="password"
        label="Password"
        form={form}
      />
      <EnhancedFormField
        type="number"
        name="number"
        label="Number"
        form={form}
      />
      <EnhancedFormField
        type="textarea"
        name="textarea"
        label="Textarea"
        form={form}
      />
      <EnhancedFormField
        type="select"
        name="select"
        label="Select"
        data={[{ value: "option1", label: "Option 1" }]}
        form={form}
      />
      <EnhancedFormField
        type="checkbox"
        name="checkbox"
        label="Checkbox"
        form={form}
      />
    </form>
  );
};

describe("useForm", () => {
  it("validates email field with Zod schema", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email/i);

    // Enter invalid email
    await user.type(emailInput, "invalid-email");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  it("validates username field with minimum length", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>
    );

    const usernameInput = screen.getByLabelText(/username/i);

    // Enter short username
    await user.type(usernameInput, "ab");
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("validates number field with minimum value", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <TestFormComponent />
      </TestWrapper>
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
      </TestWrapper>
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
        age: 25,
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
      </TestWrapper>
    );

    expect(screen.getByLabelText(/text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/textarea/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/checkbox/i)).toBeInTheDocument();
  });
});
