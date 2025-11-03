import { authHandlers } from "./auth";

/**
 * All MSW request handlers
 * Add new handler arrays here as you create them
 */
export const handlers = [...authHandlers];

// Export individual handler groups for selective use
export { authHandlers };
