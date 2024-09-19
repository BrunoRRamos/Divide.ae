import { Redis } from "ioredis";

export const publisherRedis = new Redis({});
publisherRedis.on("connect", () => {
  console.log("Publisher redis connected");
});

export const subscriberRedis = new Redis({});
subscriberRedis.on("connect", () => {
  console.log("Subscriber redis connected");
});
