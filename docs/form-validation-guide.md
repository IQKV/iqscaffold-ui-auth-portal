# Mantine Form Validation with Zod Integration Guide

This guide explains how to use the enhanced form validation system that integrates Mantine's `useForm` hook with Zod schema validation.

## Overview

The project now supports three approaches to form validation:

1. **Legacy Mantine validation** - Manual validation functions (existing approach)
2. **Pure Zod validation** - Using Zod schemas with `useEnhancedForm`
3. **Hybrid validation** - Combining Zod schemas with manual validation using `useHybridForm`

## Quick Start

### 1. Basic Form with Zod Validation

```tsx
import { z } from "zod";
import { useEnhancedForm } from "@/shared/lib";
import { EnhancedFormField } from "@/shared/ui";
import { commonSchemas, createFormSchema } from "@/shared/lib";

// Define your schema
const contactSchema = createFormSchema({
  name: commonSchemas.name,
  email: commonSchemas.email,
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

function ContactForm() {
  const form = useEnhancedForm<ContactForm>({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    schema: contactSchema,
  });

  return (
    <form onSubmit={form.onSubmit(console.log)}>
      <EnhancedFormField
        type="text"
        name="name"
        label="Name"
        required
        form={form}
      />
      <EnhancedFormField
        type="email"
        name="email"
        label="Email"
        required
        form={form}
      />
      <EnhancedFormField
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

The `EnhancedFormField` component supports all these field types:

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

Pre-built schemas are available in `commonSchemas`:

```tsx
import { commonSchemas } from "@/shared/lib";

const userSchema = createFormSchema({
  email: commonSchemas.email,
  password: commonSchemas.password,
  username: commonSchemas.username,
  name: commonSchemas.name,
  phone: commonSchemas.phone,
  url: commonSchemas.url,
});
```

## Advanced Validation Patterns

### Password Confirmation

```tsx
import { createPasswordConfirmationSchema } from "@/shared/lib";

const signupSchema = createFormSchema({
  email: commonSchemas.email,
  password: commonSchemas.password,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
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

## Examples

See `src/shared/lib/form-examples.tsx` for complete working examples of:

- Basic contact form
- User profile form with hybrid validation
- Dynamic form with conditional fields
- Real-time validation example
