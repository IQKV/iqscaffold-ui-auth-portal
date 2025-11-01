/**
 * User Menu Component
 * Displays user info and logout option
 */

import { Menu, Avatar, Text, Group, UnstyledButton } from "@mantine/core";
import { IconLogout, IconUser, IconChevronDown } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";
import {
  useCurrentUser,
  useAuthStore,
  useUserFullName,
  getUserInitials,
} from "../index";

interface UserMenuProps {
  size?: "sm" | "md" | "lg";
}

export function UserMenu({ size = "md" }: UserMenuProps) {
  const user = useCurrentUser();
  const logout = useAuthStore((state) => state.logout);
  const userFullName = useUserFullName();

  if (!user) {
    return null;
  }

  const initials = getUserInitials(user);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton>
          <Group gap="sm">
            <Avatar size={size} radius="xl" color="blue">
              {initials}
            </Avatar>
            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                {userFullName}
              </Text>
              <Text size="xs" c="dimmed">
                {user.email}
              </Text>
            </div>
            <IconChevronDown size={16} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t`Account`}</Menu.Label>

        <Menu.Item leftSection={<IconUser size={14} />}>{t`Profile`}</Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconLogout size={14} />}
          color="red"
          onClick={handleLogout}
        >
          {t`Logout`}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
