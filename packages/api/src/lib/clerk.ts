import { createClerkClient } from "@clerk/clerk-sdk-node";

// hehe
export const clerkClient: ReturnType<typeof createClerkClient> =
  createClerkClient({
    jwtKey: process.env.CLERK_JWT_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  });
