import { Card, CardProps, Title, Text, Stack } from "@mantine/core";
import { ReactNode } from "react";

interface AuthFormCardProps extends CardProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function AuthFormCard({ children, title, description, ...props }: AuthFormCardProps) {
  return (
    <Card shadow="md" padding="xl" radius="md" withBorder {...props}>
      {(title || description) && (
        <Stack gap="xs" mb="md" align="center">
          {title && (
            <Title order={2} size="h3">
              {title}
            </Title>
          )}
          {description && (
            <Text c="dimmed" size="sm" ta="center">
              {description}
            </Text>
          )}
        </Stack>
      )}
      {children}
    </Card>
  );
}
