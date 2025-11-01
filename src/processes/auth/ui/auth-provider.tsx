/**
 * Auth Provider
 * Ensures authentication is initialized before rendering children
 */

import { useEffect, type ReactNode } from "react";
import { Center, Loader } from "@mantine/core";
import { useAuthStore, useAuthInitialized } from "../index";

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthProvider({ children, fallback }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthInitialized();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return (
      fallback || (
        <Center h="100vh">
          <Loader size="lg" />
        </Center>
      )
    );
  }

  return <>{children}</>;
}
