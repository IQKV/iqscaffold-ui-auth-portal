import "@testing-library/jest-dom";
import {
  startMSWServer,
  stopMSWServer,
  resetMSWServer,
} from "@/shared/mocks/server-exports";
import { i18n } from "@lingui/core";
import { messages } from "../locales/en";

// Setup Lingui BEFORE any other imports to prevent translation errors
i18n.load("en", messages);
i18n.activate("en");

// Setup MSW server for testing
beforeAll(() => {
  startMSWServer();
});

afterEach(() => {
  resetMSWServer();
});

afterAll(() => {
  stopMSWServer();
});

// Mock window.matchMedia for Mantine components
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
