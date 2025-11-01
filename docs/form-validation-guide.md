# Mantine Form Validation with Zod Integration Guide

This guide explains how to use the enhanced form validation system that integrates Mantine's `useForm` hook with Zod schema validation. **All forms in this project now use Mantine-style validation with Zod schemas and have HTML5 validation disabled.**

## Overview

The project uses a unified approach to form validation:

1. **Mantine + Zod validation** - All forms use Zod schemas with the enhanced form hook
2. **HTML5 validation disabled** - All forms have `noValidate` attribute to prevent browser validation
3. **Consistent validation experience** - Unified error handling and display across all forms

## Quick Start

### 1. Basic Form with Zod Validation

```tsx
import { z } from "zod";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import {
  validationSchemas,
  createFormSchema,
} from "@/shared/lib/form-validation";

// Define your schema
const contactSchema = createFormSchema({
  name: validationSchemas.name,
  email: validationSchemas.email,
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

function ContactForm() {
  const form = useForm<ContactForm>({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    schema: contactSchema,
  });

  return (
    <form onSubmit={form.onSubmit(console.log)} noValidate>
      <FormField type="text" name="name" label="Name" required form={form} />
      <FormField type="email" name="email" label="Email" required form={form} />
      <FormField
        type="textarea"
        name="message"
        label="Message"
        required
        form={form}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Available Form Field Types

The `FormField` component supports all these field types:

- `text`, `email`, `tel`, `url` - Text inputs
- `password` - Password input with visibility toggle
- `textarea` - Multi-line text input
- `number` - Number input with min/max/step
- `select` - Single selection dropdown
- `multiselect` - Multiple selection dropdown
- `date` - Date picker
- `checkbox` - Checkbox input
- `switch` - Toggle switch
- `file` - File upload
- `json` - JSON editor

## Common Validation Schemas

Pre-built schemas are available in `validationSchemas`:

```tsx
import {
  validationSchemas,
  createFormSchema,
} from "@/shared/lib/form-validation";

const userSchema = createFormSchema({
  email: validationSchemas.email,
  password: validationSchemas.password,
  username: validationSchemas.username,
  firstName: validationSchemas.firstName,
  lastName: validationSchemas.lastName,
  phone: validationSchemas.phone,
  url: validationSchemas.url,
});
```

## Advanced Validation Patterns

### Password Confirmation

```tsx
import {
  createPasswordConfirmationSchema,
  validationSchemas,
} from "@/shared/lib/form-validation";

const signupSchema = createFormSchema({
  email: validationSchemas.email,
  password: validationSchemas.password,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Or use the pre-built password confirmation schema
const signupSchema = createPasswordConfirmationSchema();
```

### Conditional Validation

```tsx
const businessSchema = createFormSchema({
  accountType: z.enum(["personal", "business"]),
  name: commonSchemas.name,
  companyName: z.string().optional(),
}).refine(
  (data) => {
    if (data.accountType === "business" && !data.companyName) {
      return false;
    }
    return true;
  },
  {
    message: "Company name is required for business accounts",
    path: ["companyName"],
  }
);
```

### Array Validation

```tsx
import { arraySchemas } from "@/shared/lib";

const skillsSchema = createFormSchema({
  skills: arraySchemas.nonEmptyArray(
    z.string(),
    "Please select at least one skill"
  ),
  tags: arraySchemas.uniqueArray(z.string(), "All tags must be unique"),
});
```

### File Validation

```tsx
import { fileSchemas } from "@/shared/lib";

const profileSchema = createFormSchema({
  avatar: fileSchemas.image,
  resume: fileSchemas.document,
});
```

## Hybrid Validation (Zod + Manual)

For cases where you need both Zod validation and custom validation logic:

```tsx
import { useHybridForm } from "@/shared/lib";

const form = useHybridForm({
  initialValues: { email: "", username: "" },
  schema: userSchema,
  manualValidation: {
    email: async (value) => {
      // Custom async validation
      const exists = await checkEmailExists(value);
      return exists ? "Email already taken" : null;
    },
  },
});
```

## Migration from Legacy Forms

### Before (Legacy)

```tsx
import { useForm } from "@mantine/form";

const form = useForm({
  initialValues: { email: "", password: "" },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    password: (value) => (value.length < 8 ? "Too short" : null),
  },
});
```

### After (Zod)

```tsx
import { useEnhancedForm, commonSchemas, createFormSchema } from "@/shared/lib";

const schema = createFormSchema({
  email: commonSchemas.email,
  password: commonSchemas.password,
});

const form = useEnhancedForm({
  initialValues: { email: "", password: "" },
  schema,
});
```

## Real-time Validation

Enable validation on change and blur:

```tsx
const form = useEnhancedForm({
  initialValues: { email: "" },
  schema: emailSchema,
  validateInputOnChange: true,
  validateInputOnBlur: true,
});
```

## Form Field Props

### Common Props

- `name` - Field name (required)
- `label` - Field label (required)
- `form` - Form instance (required)
- `placeholder` - Placeholder text
- `required` - Mark as required
- `disabled` - Disable field
- `description` - Help text
- `withAsterisk` - Show asterisk for required fields

### Type-specific Props

#### Text Fields

```tsx
<EnhancedFormField
  type="text"
  name="username"
  leftSection={<IconUser />}
  rightSection={<IconCheck />}
  form={form}
/>
```

#### Select Fields

```tsx
<EnhancedFormField
  type="select"
  name="country"
  data={[
    { value: "us", label: "United States" },
    { value: "ca", label: "Canada" },
  ]}
  searchable
  clearable
  form={form}
/>
```

#### Number Fields

```tsx
<EnhancedFormField
  type="number"
  name="age"
  min={0}
  max={120}
  step={1}
  form={form}
/>
```

## Error Handling

### Custom Error Messages

```tsx
const schema = createFormSchema({
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(18, "You must be at least 18 years old"),
});
```

### Internationalization

```tsx
import { t } from "@lingui/core/macro";

const schema = createFormSchema({
  email: z.string().email(t`Please enter a valid email address`),
});
```

## Best Practices

1. **Use TypeScript** - Always infer types from schemas
2. **Reuse schemas** - Create reusable schema components
3. **Validate early** - Use real-time validation for better UX
4. **Internationalize** - Use Lingui for error messages
5. **Test validation** - Write tests for complex validation logic

## Testing Forms

```tsx
import { render, screen, userEvent } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";

test("validates email field", async () => {
  render(
    <MantineProvider>
      <ContactForm />
    </MantineProvider>
  );

  const emailInput = screen.getByLabelText(/email/i);
  await userEvent.type(emailInput, "invalid-email");
  await userEvent.tab(); // Trigger blur validation

  expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
});
```

## Performance Considerations

- Use `validateInputOnChange` sparingly for complex validations
- Consider debouncing for async validations
- Use `React.memo` for form components with many fields
- Lazy load validation schemas for large forms

## Implemented Forms

The project includes several fully implemented forms with Mantine + Zod validation:

### Authentication Forms

All authentication forms have HTML5 validation disabled and use Zod schemas:

- **Sign In Form** (`src/features/signin-form/`) - Username/email and password validation
- **Sign Up Form** (`src/features/signup-form/`) - Complete user registration with password confirmation
- **Forgot Password Form** (`src/features/forgot-password-form/`) - Email validation for password reset
- **Reset Password Form** (`src/features/reset-password-form/`) - New password with confirmation
- **Email Verification Form** (`src/features/email-verification-form/`) - Email validation for resending verification

### User Management Forms

- **User Form** (`src/features/users/components/user-form.tsx`) - Create/edit users with role selection
- **User Form Modal** (`src/features/users/components/user-form-modal.tsx`) - Modal wrapper for user operations

### Form Features

All forms include:

- Real-time validation with Zod schemas
- Internationalized error messages using Lingui
- Consistent styling with Mantine components
- Accessibility features (ARIA labels, keyboard navigation)
- Loading states and error handling
- No HTML5 validation interference

## Examples

### Authentication Form Example

```tsx
// Sign-in form implementation
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import { signInFormSchema, initialSignInValues } from "./validation";

export function SignInForm() {
  const form = useForm({
    initialValues: initialSignInValues,
    schema: signInFormSchema,
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <FormField
        type="text"
        name="username"
        label={t`Username or Email`}
        required
        form={form}
      />
      <FormField
        type="password"
        name="password"
        label={t`Password`}
        required
        form={form}
      />
      <Button type="submit">Sign In</Button>
    </form>
  );
}
```

### User Management Form Example

```tsx
// User form with role selection
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { FormField } from "@/shared/ui";
import { Select } from "@mantine/core";
import { userFormSchema, initialUserValues } from "./validation";

export function UserForm({ onSubmit }) {
  const form = useForm({
    initialValues: initialUserValues,
    schema: userFormSchema,
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)} noValidate>
      <Group grow>
        <FormField
          type="text"
          name="firstName"
          label="First Name"
          required
          form={form}
        />
        <FormField
          type="text"
          name="lastName"
          label="Last Name"
          required
          form={form}
        />
      </Group>

      <FormField
        type="text"
        name="username"
        label="Username"
        required
        form={form}
      />

      <FormField type="email" name="email" label="Email" required form={form} />

      <Select
        label="Role"
        data={[
          { value: "user", label: "User" },
          { value: "admin", label: "Admin" },
        ]}
        required
        {...form.getInputProps("role")}
      />

      <Button type="submit">Create User</Button>
    </form>
  );
}
```
