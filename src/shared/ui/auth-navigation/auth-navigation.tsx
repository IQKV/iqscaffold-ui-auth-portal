import { Anchor, Group, Text } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { t } from "@lingui/core/macro";

interface AuthLinkProps {
  onClick: () => void;
  "data-testid"?: string;
}

export function AuthLinkToLogin({ onClick, "data-testid": testId }: AuthLinkProps) {
  return (
    <Group justify="center" gap="xs">
      <Anchor size="sm" onClick={onClick} data-testid={testId || "link-login"}>
        {t`Already have an account? Sign in`}
      </Anchor>
    </Group>
  );
}

export function AuthLinkToRegister({ onClick, "data-testid": testId }: AuthLinkProps) {
  return (
    <Group justify="center" gap="xs">
      <Anchor size="sm" onClick={onClick} data-testid={testId || "link-register"}>
        {t`Don't have an account? Sign up`}
      </Anchor>
    </Group>
  );
}

export function AuthLinkToForgotPassword({ onClick, "data-testid": testId }: AuthLinkProps) {
  return (
    <Anchor
      component="button"
      type="button"
      size="sm"
      onClick={onClick}
      data-testid={testId || "link-forgot-password"}
    >
      {t`Forgot password?`}
    </Anchor>
  );
}

export function AuthLinkBackToLogin({ onClick, "data-testid": testId }: AuthLinkProps) {
  return (
    <Group justify="center" gap="xs">
      <Anchor
        component="button"
        type="button"
        size="sm"
        onClick={onClick}
        data-testid={testId || "link-back-to-login"}
      >
        <Group gap="xs" align="center">
          <IconArrowLeft size={14} />
          {t`Back to Sign In`}
        </Group>
      </Anchor>
    </Group>
  );
}
