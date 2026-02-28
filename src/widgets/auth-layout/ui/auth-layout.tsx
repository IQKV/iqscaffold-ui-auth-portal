import { Box, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { ReactNode, useMemo } from "react";
import { Helmet } from "@dr.pogodin/react-helmet";
import { ThemeToggle } from "@/widgets/theme-toggle";
import { LocaleSwitcher } from "@/shared/ui";
import classes from "./auth-layout.module.css";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  pageTitle?: string;
}

interface ParticleStyle {
  top: string;
  left: string;
  animationDuration: string;
  animationDelay: string;
}

// Generate particles outside component to avoid impure function calls during render
const generateParticles = (): ParticleStyle[] =>
  Array.from({ length: 8 }, () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDuration: `${20 + Math.random() * 20}s`,
    animationDelay: `${Math.random() * 10}s`,
  }));

const particles = generateParticles();

export function AuthLayout({
  children,
  title,
  subtitle,
  pageTitle,
}: AuthLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{pageTitle || title} | IQ Scaffold</title>
      </Helmet>
      <Flex
        pos="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        w="100vw"
        h="100vh"
        direction={{ base: "column", md: "row" }}
        style={{ overflow: "hidden" }}
        data-testid="auth-layout"
      >
        {/* Left Side - Form Container (Wider) */}
        <Box
          flex={{ base: "1", md: "0 0 65%" }}
          bg={{ light: "gray.0", dark: "dark.7" }}
          style={{
            overflow: "auto",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.08)",
            position: "relative",
            zIndex: 1,
          }}
          data-testid="auth-layout-form-container"
        >
          {/* Controls - Top Right */}
          <Box pos="absolute" top="1rem" right="1rem" style={{ zIndex: 10 }}>
            <Group gap="sm">
              <LocaleSwitcher />
              <ThemeToggle />
            </Group>
          </Box>

          <Flex
            direction="column"
            justify="center"
            mih="100%"
            p={{ base: "xl", sm: "3rem", md: "4rem" }}
          >
            <Box w="100%" maw={560} mx="auto">
              <Stack gap="xl">
                <Stack gap="xs">
                  <Title
                    order={1}
                    fz={{ base: "1.75rem", sm: "2rem" }}
                    fw={700}
                  >
                    {title}
                  </Title>
                  {subtitle && (
                    <Text size="sm" c="dimmed">
                      {subtitle}
                    </Text>
                  )}
                </Stack>

                {children}
              </Stack>
            </Box>
          </Flex>
        </Box>

        {/* Right Side - Techy Gradient */}
        <Box
          flex={{ base: "0", md: "0 0 35%" }}
          display={{ base: "none", md: "block" }}
          pos="relative"
          className={classes.rightSide}
        >
          {/* Animated gradient orbs */}
          <Box className={`${classes.gradientOrb} ${classes.gradientOrb1}`} />
          <Box className={`${classes.gradientOrb} ${classes.gradientOrb2}`} />

          {/* Tech pattern overlay */}
          <Box className={classes.techPattern} />

          {/* Floating particles */}
          {particles.map((style, i) => (
            <Box key={i} className={classes.particle} style={style} />
          ))}
        </Box>
      </Flex>
    </>
  );
}
