import {
  Button,
  Group,
  Stack,
  TextInput,
  Collapse,
  Text,
  PasswordInput,
} from "@mantine/core";
import { IconBuildingSkyscraper, IconChevronDown } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";
import { t } from "@lingui/core/macro";
import { useState, useMemo } from "react";
import { type OrganizationSignupResponse } from "@/shared/api";
import { useForm } from "@/shared/lib/enhanced-form-hook";
import { useOrganizationSignup } from "@/shared/lib/use-auth-api";
import { AuthFormCard, AuthLinkToLogin } from "@/shared/ui";
import {
  organizationSignUpFormSchema,
  initialOrganizationSignUpValues,
  type OrganizationSignUpFormSchemaType,
} from "../model/validation";

interface OrganizationSignUpFormFeatureProps {
  onSuccess?: (data: OrganizationSignupResponse) => void;
  onNavigateToLogin?: () => void;
}

export function OrganizationSignUpFormFeature({
  onSuccess,
  onNavigateToLogin,
}: OrganizationSignUpFormFeatureProps) {
  const navigate = useNavigate();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<OrganizationSignUpFormSchemaType>({
    initialValues: initialOrganizationSignUpValues,
    schema: organizationSignUpFormSchema,
  });

  const organizationSignupMutation = useOrganizationSignup();

  // Auto-generate tenant ID preview from organization name
  const previewTenantId = useMemo(() => {
    const orgName = form.values.organizationName;
    if (orgName && !form.values.tenantId) {
      return orgName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50);
    }
    return "";
  }, [form.values.organizationName, form.values.tenantId]);

  const handleSubmit = (values: OrganizationSignUpFormSchemaType) => {
    const { confirmPassword, ...signupData } = values;

    // Remove empty optional fields
    const cleanedData = {
      ...signupData,
      tenantId: signupData.tenantId || undefined,
      domain: signupData.domain || undefined,
    };

    organizationSignupMutation.mutate(cleanedData, {
      onSuccess: (data) => {
        if (onSuccess) {
          onSuccess(data);
        } else {
          // Navigate to success page or login
          navigate({ to: "/" });
        }
      },
    });
  };

  const handleNavigateToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate({ to: "/" });
    }
  };

  return (
    <AuthFormCard data-testid="organization-signup-form">
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <Stack gap="md">
          {/* Organization Information */}
          <TextInput
            label={t`Organization Name`}
            placeholder={t`ACME Corporation`}
            required
            data-testid="org-signup-input-organization-name"
            {...form.getInputProps("organizationName")}
          />

          {/* Admin User Information */}
          <Group grow>
            <TextInput
              label={t`Admin First Name`}
              placeholder={t`John`}
              required
              data-testid="org-signup-input-admin-firstname"
              {...form.getInputProps("adminFirstName")}
            />
            <TextInput
              label={t`Admin Last Name`}
              placeholder={t`Doe`}
              required
              data-testid="org-signup-input-admin-lastname"
              {...form.getInputProps("adminLastName")}
            />
          </Group>

          <TextInput
            label={t`Admin Username`}
            placeholder={t`johndoe`}
            required
            description={t`3-50 characters, letters, numbers, and underscores only`}
            data-testid="org-signup-input-admin-username"
            {...form.getInputProps("adminUsername")}
          />

          <TextInput
            label={t`Admin Email`}
            placeholder={t`john.doe@example.com`}
            required
            type="email"
            data-testid="org-signup-input-admin-email"
            {...form.getInputProps("adminEmail")}
          />

          <PasswordInput
            label={t`Admin Password`}
            placeholder={t`Enter a strong password`}
            required
            description={t`8+ characters with uppercase, lowercase, number, and special character`}
            data-testid="org-signup-input-admin-password"
            {...form.getInputProps("adminPassword")}
          />

          <PasswordInput
            label={t`Confirm Password`}
            placeholder={t`Re-enter your password`}
            required
            data-testid="org-signup-input-confirm-password"
            {...form.getInputProps("confirmPassword")}
          />

          {/* Advanced Options */}
          <Button
            variant="subtle"
            size="xs"
            onClick={() => setShowAdvanced(!showAdvanced)}
            rightSection={
              <IconChevronDown
                size={16}
                style={{
                  transform: showAdvanced ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                }}
              />
            }
          >
            {t`Advanced Options`}
          </Button>

          <Collapse in={showAdvanced}>
            <Stack gap="md">
              <TextInput
                label={t`Custom Tenant ID`}
                placeholder={
                  previewTenantId || t`Auto-generated from organization name`
                }
                description={t`Leave empty to auto-generate. Only lowercase letters, numbers, and hyphens allowed.`}
                data-testid="org-signup-input-tenant-id"
                {...form.getInputProps("tenantId")}
              />

              <TextInput
                label={t`Custom Domain`}
                placeholder="acme.example.com"
                description={t`Optional custom domain for your organization`}
                data-testid="org-signup-input-domain"
                {...form.getInputProps("domain")}
              />
            </Stack>
          </Collapse>

          <Button
            type="submit"
            fullWidth
            leftSection={<IconBuildingSkyscraper size={18} />}
            loading={organizationSignupMutation.isPending}
            data-testid="org-signup-button-submit"
          >
            {t`Create Organization`}
          </Button>

          <Text size="sm" c="dimmed" ta="center">
            {t`Joining an existing team?`}{" "}
            <Button
              variant="subtle"
              size="compact-sm"
              onClick={() => navigate({ to: "/register" })}
            >
              {t`Sign up as team member`}
            </Button>
          </Text>

          <AuthLinkToLogin
            onClick={handleNavigateToLogin}
            data-testid="org-signup-link-login"
          />
        </Stack>
      </form>
    </AuthFormCard>
  );
}
