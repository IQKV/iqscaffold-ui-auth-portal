import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";
import { getMSWConfig } from "@/shared/lib/msw-config";

const config = getMSWConfig();

/**
 * Browser MSW worker setup
 * This sets up MSW for development and browser environments
 */
export const worker = setupWorker(...handlers);

/**
 * Start MSW in browser environment
 */
export async function startMSW() {
  if (!config.enabled) {
    if (config.enableLogging) {
      console.log("🚫 MSW: Disabled via configuration");
    }
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: config.onUnhandledRequest,
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });

    if (config.enableLogging) {
      console.log("🎭 MSW: Started successfully");
      console.log("📋 MSW: Mocking the following APIs:");
      handlers.forEach((handler) => {
        const method =
          typeof handler.info.method === "string"
            ? handler.info.method.toUpperCase()
            : handler.info.method?.toString() || "ALL";
        console.log(`  - ${method} ${handler.info.path}`);
      });
    }
  } catch (error) {
    console.error("❌ MSW: Failed to start", error);
  }
}

/**
 * Stop MSW worker
 */
export async function stopMSW() {
  if (worker) {
    worker.stop();
    if (config.enableLogging) {
      console.log("🛑 MSW: Stopped");
    }
  }
}
