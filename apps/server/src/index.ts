import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import ws from "ws";

import { appRouter, createTRPCContext } from "@/api";

const port = parseInt(process.env.PORT || "3000");

createHTTPServer({
  router: appRouter,
  createContext: createTRPCContext,
}).listen(port + 1, () => {
  console.log("🚀 Server started at http://localhost:" + (port + 1));
});

const wss = new ws.Server({
  port,
});

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createTRPCContext,
  // Enable heartbeat messages to keep connection open (disabled by default)
  keepAlive: {
    enabled: true,
    // server ping message interval in milliseconds
    pingMs: 30000,
    // connection is terminated if pong message is not received in this many milliseconds
    pongWaitMs: 5000,
  },
});

wss.on("connection", (ws) => {
  console.log(`++ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`-- Connection (${wss.clients.size})`);
  });
});

console.log(
  `🚀 Websocket server listening on port ${process.env.PORT ?? 3000}`,
);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});
