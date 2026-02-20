import { Paper, Stack, Text, Group, Badge, ThemeIcon } from "@mantine/core";
import {
  IconBuilding,
  IconBriefcase,
  IconMapPin,
  IconUser,
  IconClock,
} from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import type { OrganizationPreviewDto } from "@/shared/api/invitation-api";

interface OrganizationPreviewProps {
  organization: OrganizationPreviewDto;
}

function isInvitationExpiringSoon(expiresAt: Date): boolean {
  const now = new Date();
  const timeDiff = expiresAt.getTime() - now.getTime();
  return timeDiff < 24 * 60 * 60 * 1000; // Less than 24 hours
}

export function OrganizationPreview({
  organization,
}: OrganizationPreviewProps) {
  const expiresAt = new Date(organization.invitationExpiresAt);
  const isExpiringSoon = isInvitationExpiringSoon(expiresAt);

  return (
    <Paper p="lg" withBorder shadow="sm" data-testid="organization-preview">
      <Stack gap="md">
        <Group gap="sm">
          <ThemeIcon size="lg" variant="light" color="blue">
            <IconBuilding size={20} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={600}>
              {organization.name}
            </Text>
            <Text size="sm" c="dimmed">
              {t`You've been invited to join this organization`}
            </Text>
          </div>
        </Group>

        {organization.description && (
          <Text size="sm">{organization.description}</Text>
        )}

        <Stack gap="xs">
          {organization.industry && (
            <Group gap="xs">
              <IconBriefcase size={16} />
              <Text size="sm">{organization.industry}</Text>
            </Group>
          )}

          {(organization.city || organization.country) && (
            <Group gap="xs">
              <IconMapPin size={16} />
              <Text size="sm">
                {[organization.city, organization.country]
                  .filter(Boolean)
                  .join(", ")}
              </Text>
            </Group>
          )}

          <Group gap="xs">
            <IconUser size={16} />
            <Text size="sm">
              {t`Invited by`} <strong>{organization.invitedByUsername}</strong>
            </Text>
          </Group>

          <Group gap="xs">
            <IconClock size={16} />
            <Text size="sm">
              {t`Invitation expires`}:{" "}
              <Badge
                color={isExpiringSoon ? "red" : "blue"}
                variant="light"
                size="sm"
              >
                {expiresAt.toLocaleString()}
              </Badge>
            </Text>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
