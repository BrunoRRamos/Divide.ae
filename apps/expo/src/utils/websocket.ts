import { createWSClient } from "@trpc/client";

const defaultWSUrl = "ws://localhost:3000/";
const url = process.env.EXPO_PUBLIC_WS_URL || defaultWSUrl;

export const wsClient = createWSClient({
  url,
  onOpen: () => {
    console.log(`ws client connected on ${url}`);
  },
});
