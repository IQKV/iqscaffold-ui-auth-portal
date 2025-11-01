import { StrictMode, useEffect } from "react";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

// Import the generated route tree
import { routeTree } from "@/routeTree.gen";
import { theme } from "./theme";
import { queryClient } from "@/shared/lib";

import { ErrorBoundary } from "@/shared/ui";
import { MSWDevTools } from "@/shared/ui/msw-dev-tools";
import { AuthProvider } from "@/processes/auth";

import { ConfirmContextModal } from "@/shared/ui/confirmation-modal";

// MSW setup
import { startMSW } from "@/shared/mocks";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  useEffect(() => {
    // Load locale messages asynchronously after component mounts
    const loadLocale = async () => {
      const { dynamicActivateLocale, getClientLocale } = await import(
        "@/shared/locales"
      );
      await dynamicActivateLocale(getClientLocale());
    };

    // Initialize auth effects
    const initAuthEffects = async () => {
      const { AuthEffects } = await import("@/processes/auth");
      AuthEffects.getInstance().initialize();
    };

    loadLocale().catch(console.error);
    initAuthEffects().catch(console.error);

    // Start MSW if enabled
    if (typeof window !== "undefined") {
      startMSW();
    }

    // Cleanup auth effects on unmount
    return () => {
      import("@/processes/auth").then(({ AuthEffects }) => {
        AuthEffects.getInstance().cleanup();
      });
    };
  }, []);

  return (
    <StrictMode>
      <HelmetProvider>
        <I18nProvider i18n={i18n}>
          <ErrorBoundary>
            <MantineProvider theme={theme}>
              <ModalsProvider modals={{ confirmation: ConfirmContextModal }}>
                <Notifications />
                <QueryClientProvider client={queryClient}>
                  <AuthProvider>
                    <RouterProvider router={router} />
                    <ReactQueryDevtools initialIsOpen={false} />
                    <MSWDevTools />
                  </AuthProvider>
                </QueryClientProvider>
              </ModalsProvider>
            </MantineProvider>
          </ErrorBoundary>
        </I18nProvider>
      </HelmetProvider>
    </StrictMode>
  );
}
