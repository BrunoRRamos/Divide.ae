import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({server: {
  PORT: z.string().default("8080")
}, runtimeEnv: {
  port: process.env.PORT
}})