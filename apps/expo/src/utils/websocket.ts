import { getClerkInstance } from "@clerk/clerk-expo";
import { createWSClient } from "@trpc/client";

import { getBaseUrl } from "./base-url";

const defaultWSUrl = "ws://localhost:3000";
const url = process.env.EXPO_PUBLIC_WS_URL || defaultWSUrl;

export const wsClient = createWSClient({
  url: getBaseUrl("ws", "3000"),
  onOpen: () => {
    console.log(`ws client connected on ${url}`);
  },
  onClose: () => {
    console.log(`ws client disconnected on ${url}`);
  },
  lazy: {
    enabled: true,
    closeMs: 1000,
  },
  connectionParams: async () => {
    const headers = new Map<string, string>();
    const token = await getClerkInstance().session?.getToken();
    headers.set("x-trpc-source", "expo-react");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return Object.fromEntries(headers);
  },
});
