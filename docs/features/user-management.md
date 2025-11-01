# User Management Feature

This document describes the user management feature implementation, including forms, validation, and API integration.

## Overview

The user management feature provides complete CRUD (Create, Read, Update, Delete) operations for managing users in the application. It demonstrates the project's form validation architecture using Mantine + Zod with HTML5 validation disabled.

## Feature Structure

```
src/features/users/
├── api/
│   └── users-api.ts          # API client functions
├── components/
│   ├── user-form.tsx         # Reusable user form component
│   ├── user-form-modal.tsx   # Modal wrapper for user form
│   ├── users-list.tsx        # Users list with CRUD operations
│   └── users-page.tsx        # Main users page component
├── hooks/
│   └── use-users-query.ts    # React Query hooks
├── model/
│   ├── validation.ts         # Zod validation schemas
│   ├── validation.test.ts    # Validation tests
│   └── mappers.ts           # Data transformation utilities
└── index.ts                 # Feature exports
```

## Components

### UserForm

A reusable form component for creating and editing users.

**Features:**

- Zod validation with real-time feedback
- Support for create and edit modes
- Internationalized labels and error messages
- Accessibility features (ARIA labels, keyboard navigation)
- Loading states and error handling

**Props:**

```typescript
interface UserFormProps {
  user?: Partial<UserFormSchemaType> & { id?: string };
  onSubmit: (values: UserFormSchemaType) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}
```

**Usage:**

```tsx
<UserForm
  user={editingUser}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={mutation.isPending}
/>
```

### UserFormModal

A modal wrapper for the UserForm component.

**Features:**

- Modal dialog with proper focus management
- Dynamic title based on create/edit mode
- Automatic form submission and modal closing
- Responsive design

### UsersList

The main component displaying users in a table format with CRUD operations.

**Features:**

- Paginated user list with search functionality
- Inline edit and delete actions
- Create new user button
- Loading states and error handling
- Responsive table design

## Validation Schema

The user form uses a comprehensive Zod schema:

```typescript
export const userFormSchema = z.object({
  firstName: validationSchemas.firstName,
  lastName: validationSchemas.lastName,
  username: validationSchemas.username,
  email: validationSchemas.email,
  role: z.enum(["user", "admin"], {
    required_error: "Role is required",
    invalid_type_error: "Please select a valid role",
  }),
});
```

### Validation Rules

- **First Name**: Required, 1-100 characters, trimmed
- **Last Name**: Required, 1-100 characters, trimmed
- **Username**: Required, 3-50 characters, alphanumeric + underscores only
- **Email**: Required, valid email format
- **Role**: Required, must be "user" or "admin"

## Data Mapping

The feature includes data mappers to transform between form data and API data:

### Form to API Mapping

```typescript
export function mapFormToCreateRequest(
  formData: UserFormSchemaType
): CreateUserRequest {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    email: formData.email,
    username: formData.username,
    role: formData.role,
  };
}
```

### API to Form Mapping

```typescript
export function mapUserToForm(user: User): UserFormSchemaType {
  const nameParts = user.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return {
    firstName,
    lastName,
    username: user.name.toLowerCase().replace(/\s+/g, ""),
    email: user.email,
    role: user.role as "user" | "admin",
  };
}
```

## API Integration

### Endpoints

- `GET /v1/users` - List users with pagination and search
- `GET /v1/users/:id` - Get user by ID
- `POST /v1/users` - Create new user
- `PUT /v1/users/:id` - Update user
- `DELETE /v1/users/:id` - Delete user

### React Query Hooks

```typescript
// Fetch users with pagination and search
const { data, isLoading, error } = useUsersQuery({ page, limit, search });

// Create user mutation
const createUserMutation = useCreateUserMutation();

// Update user mutation
const updateUserMutation = useUpdateUserMutation();

// Delete user mutation
const deleteUserMutation = useDeleteUserMutation();
```

### Query Key Management

```typescript
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
};
```

## Form Validation Features

### HTML5 Validation Disabled

All forms use `noValidate` attribute to disable browser validation:

```tsx
<form onSubmit={form.onSubmit(handleSubmit)} noValidate>
  {/* Form fields */}
</form>
```

### Real-time Validation

Validation occurs on:

- Field blur (when user leaves a field)
- Form submission
- Field change (for immediate feedback on corrections)

### Error Display

Errors are displayed using Mantine's built-in error styling:

- Red border on invalid fields
- Error message below the field
- Proper ARIA attributes for screen readers

### Internationalization

All validation messages support internationalization using Lingui:

```typescript
firstName: z.string()
  .trim()
  .min(1, t`First name is required`)
  .max(100, t`First name must be less than 100 characters`),
```

## Testing

### Validation Tests

Comprehensive test coverage for all validation scenarios:

```typescript
describe("user form validation", () => {
  describe("firstName validation", () => {
    it("should return error for empty first name", () => {
      // Test implementation
    });

    it("should accept valid first name", () => {
      // Test implementation
    });
  });
  // More validation tests...
});
```

### Component Tests

Tests for user interactions and form behavior:

```typescript
test("should create new user", async () => {
  const user = userEvent.setup();
  render(<UserForm onSubmit={mockSubmit} />);

  await user.type(screen.getByLabelText(/first name/i), "John");
  await user.type(screen.getByLabelText(/last name/i), "Doe");
  await user.type(screen.getByLabelText(/email/i), "john@example.com");
  await user.click(screen.getByRole("button", { name: /create user/i }));

  expect(mockSubmit).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    username: expect.any(String),
    email: "john@example.com",
    role: "user",
  });
});
```

## Usage Examples

### Basic Usage

```tsx
import { UsersList } from "@/features/users";

function UsersPage() {
  return (
    <Container>
      <Title>Users</Title>
      <UsersList />
    </Container>
  );
}
```

### Custom User Form

```tsx
import { UserForm } from "@/features/users";
import { useCreateUserMutation } from "@/features/users";

function CreateUserPage() {
  const createUser = useCreateUserMutation();

  const handleSubmit = async (formData) => {
    const apiData = mapFormToCreateRequest(formData);
    await createUser.mutateAsync(apiData);
  };

  return <UserForm onSubmit={handleSubmit} isLoading={createUser.isPending} />;
}
```

## Best Practices

1. **Validation First**: Always define Zod schemas before implementing forms
2. **Data Mapping**: Use mapper functions to transform between form and API data
3. **Error Handling**: Provide clear, actionable error messages
4. **Accessibility**: Include proper ARIA labels and keyboard navigation
5. **Testing**: Write comprehensive tests for validation logic and user interactions
6. **Internationalization**: Use translation functions for all user-facing text

## Performance Considerations

- Form validation is optimized with Zod's efficient parsing
- React Query provides automatic caching and background updates
- Components use proper memoization to prevent unnecessary re-renders
- Large user lists are paginated to improve performance

## Security Considerations

- All user input is validated on both client and server
- Role-based access control for user management operations
- Proper authentication required for all user operations
- Input sanitization to prevent XSS attacks

This user management feature serves as a reference implementation for building forms with the project's validation architecture.
