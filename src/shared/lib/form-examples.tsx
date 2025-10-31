import React from "react";
import { Button, Stack, Group, Card, Title, Text } from "@mantine/core";
import { z } from "zod";
import { t } from "@lingui/core/macro";
import { useForm } from "./enhanced-form-hook";
import { EnhancedFormField } from "../ui/enhanced-form-field";
import {
  createFormSchema,
  createValidationSchemas,
  createArraySchemas,
  createFileSchemas,
} from "./form-validation";

// Example 1: Basic Contact Form with Zod
const createContactFormSchema = () => {
  const schemas = createValidationSchemas();
  return createFormSchema({
    name: schemas.name,
    email: schemas.email,
    phone: schemas.phone,
    message: z.string().min(10, t`Message must be at least 10 characters`),
    contactMethod: z.enum(["email", "phone"], {
      errorMap: () => ({ message: t`Please select a contact method` }),
    }),
    urgency: z.enum(["low", "medium", "high"]).optional(),
  });
};

const contactFormSchema = createContactFormSchema();

type ContactFormType = z.infer<typeof contactFormSchema>;

export function ContactFormExample() {
  const form = useForm<ContactFormType>({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      contactMethod: "email" as const,
      urgency: "medium" as const,
    },
    schema: contactFormSchema,
  });

  const handleSubmit = (values: ContactFormType) => {
    console.log("Contact form submitted:", values);
  };

  return (
    <Card withBorder padding="md">
      <Title order={3} mb="md">
        Contact Form (Zod Validation)
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <EnhancedFormField
            type="text"
            name="name"
            label="Full Name"
            placeholder="Enter your full name"
            required
            form={form}
          />

          <EnhancedFormField
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            form={form}
          />

          <EnhancedFormField
            type="tel"
            name="phone"
            label="Phone Number"
            placeholder="Enter your phone number"
            form={form}
          />

          <EnhancedFormField
            type="select"
            name="contactMethod"
            label="Preferred Contact Method"
            data={[
              { value: "email", label: "Email" },
              { value: "phone", label: "Phone" },
            ]}
            required
            form={form}
          />

          <EnhancedFormField
            type="select"
            name="urgency"
            label="Urgency Level"
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            form={form}
          />

          <EnhancedFormField
            type="textarea"
            name="message"
            label="Message"
            placeholder="Enter your message"
            rows={4}
            required
            form={form}
          />

          <Button type="submit">Send Message</Button>
        </Stack>
      </form>
    </Card>
  );
}

// Example 2: User Profile Form
const createProfileFormSchema = () => {
  const schemas = createValidationSchemas();
  const arrays = createArraySchemas();
  const files = createFileSchemas();
  return createFormSchema({
    firstName: schemas.firstName,
    lastName: schemas.lastName,
    email: schemas.email,
    bio: z
      .string()
      .max(500, t`Bio must be less than 500 characters`)
      .optional(),
    website: schemas.url,
    birthDate: z.string().optional(),
    skills: arrays.nonEmptyArray(
      z.string(),
      t`Please select at least one skill`
    ),
    isPublic: z.boolean(),
    avatar: files.image.optional(),
  });
};

const profileFormSchema = createProfileFormSchema();

type ProfileFormType = z.infer<typeof profileFormSchema>;

export function ProfileFormExample() {
  const form = useForm<ProfileFormType>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      website: "",
      birthDate: "",
      skills: [],
      isPublic: false,
      avatar: undefined,
    },
    schema: profileFormSchema,
  });

  const handleSubmit = (values: ProfileFormType) => {
    console.log("Profile form submitted:", values);
  };

  return (
    <Card withBorder padding="md">
      <Title order={3} mb="md">
        Profile Form (Hybrid Validation)
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Group grow>
            <EnhancedFormField
              type="text"
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              required
              form={form}
            />

            <EnhancedFormField
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              required
              form={form}
            />
          </Group>

          <EnhancedFormField
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            form={form}
          />

          <EnhancedFormField
            type="url"
            name="website"
            label="Website"
            placeholder="https://example.com"
            form={form}
          />

          <EnhancedFormField
            type="date"
            name="birthDate"
            label="Birth Date"
            max={new Date().toISOString().split("T")[0]}
            form={form}
          />

          <EnhancedFormField
            type="multiselect"
            name="skills"
            label="Skills"
            data={[
              { value: "javascript", label: "JavaScript" },
              { value: "typescript", label: "TypeScript" },
              { value: "react", label: "React" },
              { value: "nodejs", label: "Node.js" },
              { value: "python", label: "Python" },
            ]}
            searchable
            required
            form={form}
          />

          <EnhancedFormField
            type="textarea"
            name="bio"
            label="Bio"
            placeholder="Tell us about yourself"
            autosize
            minRows={3}
            maxRows={6}
            form={form}
          />

          <EnhancedFormField
            type="file"
            name="avatar"
            label="Profile Picture"
            accept="image/*"
            form={form}
          />

          <EnhancedFormField
            type="switch"
            name="isPublic"
            label="Make profile public"
            form={form}
          />

          <Button type="submit">Save Profile</Button>
        </Stack>
      </form>
    </Card>
  );
}

// Example 3: Dynamic Form with Conditional Fields
const createDynamicFormSchema = () => {
  const schemas = createValidationSchemas();
  return createFormSchema({
    accountType: z.enum(["personal", "business"]),
    email: schemas.email,
    // Conditional fields based on account type
    personalName: z.string().optional(),
    businessName: z.string().optional(),
    businessSize: z.enum(["small", "medium", "large"]).optional(),
    taxId: z.string().optional(),
  }).refine(
    (data) => {
      if (data.accountType === "personal" && !data.personalName) {
        return false;
      }
      if (
        data.accountType === "business" &&
        (!data.businessName || !data.businessSize)
      ) {
        return false;
      }
      return true;
    },
    {
      message: t`Please fill in all required fields for your account type`,
      path: ["accountType"],
    }
  );
};

const dynamicFormSchema = createDynamicFormSchema();

type DynamicFormType = z.infer<typeof dynamicFormSchema>;

export function DynamicFormExample() {
  const form = useForm<DynamicFormType>({
    initialValues: {
      accountType: "personal" as const,
      email: "",
      personalName: "",
      businessName: "",
      businessSize: "small" as const,
      taxId: "",
    },
    schema: dynamicFormSchema,
  });

  const accountType = form.values.accountType;

  const handleSubmit = (values: DynamicFormType) => {
    console.log("Dynamic form submitted:", values);
  };

  return (
    <Card withBorder padding="md">
      <Title order={3} mb="md">
        Dynamic Form (Conditional Validation)
      </Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <EnhancedFormField
            type="select"
            name="accountType"
            label="Account Type"
            data={[
              { value: "personal", label: "Personal Account" },
              { value: "business", label: "Business Account" },
            ]}
            required
            form={form}
          />

          <EnhancedFormField
            type="email"
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            required
            form={form}
          />

          {accountType === "personal" && (
            <EnhancedFormField
              type="text"
              name="personalName"
              label="Full Name"
              placeholder="Enter your full name"
              required
              form={form}
            />
          )}

          {accountType === "business" && (
            <>
              <EnhancedFormField
                type="text"
                name="businessName"
                label="Business Name"
                placeholder="Enter your business name"
                required
                form={form}
              />

              <EnhancedFormField
                type="select"
                name="businessSize"
                label="Business Size"
                data={[
                  { value: "small", label: "Small (1-10 employees)" },
                  { value: "medium", label: "Medium (11-100 employees)" },
                  { value: "large", label: "Large (100+ employees)" },
                ]}
                required
                form={form}
              />

              <EnhancedFormField
                type="text"
                name="taxId"
                label="Tax ID (Optional)"
                placeholder="Enter your tax ID"
                form={form}
              />
            </>
          )}

          <Button type="submit">Create Account</Button>
        </Stack>
      </form>
    </Card>
  );
}

// Example 4: Form with Real-time Validation
export function RealTimeValidationExample() {
  const schemas = createValidationSchemas();
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    schema: createFormSchema({
      username: schemas.username,
      email: schemas.email,
      password: schemas.password,
    }),
    // Enable real-time validation
    validateInputOnChange: true,
    validateInputOnBlur: true,
  });

  return (
    <Card withBorder padding="md">
      <Title order={3} mb="md">
        Real-time Validation Example
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Validation happens as you type and when you leave each field
      </Text>
      <form onSubmit={form.onSubmit(console.log)}>
        <Stack gap="md">
          <EnhancedFormField
            type="text"
            name="username"
            label="Username"
            placeholder="Enter username"
            required
            form={form}
          />

          <EnhancedFormField
            type="email"
            name="email"
            label="Email"
            placeholder="Enter email"
            required
            form={form}
          />

          <EnhancedFormField
            type="password"
            name="password"
            label="Password"
            placeholder="Enter password"
            required
            form={form}
          />

          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Card>
  );
}
