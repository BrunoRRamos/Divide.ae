import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import type { User } from "@/db";
import type { Session } from "@clerk/clerk-sdk-node";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import { db } from "@/db";

import { clerkClient } from "./lib/clerk";

type CreateContextOpts = CreateHTTPContextOptions | CreateWSSContextFnOptions;

type CreateContextInnerOptions = Partial<CreateContextOpts> & {
  authorization?: string;
};

export const createContextInner = async (opts: CreateContextInnerOptions) => {
  let session: Session | null = null;
  let user: User | null = null;

  const token = opts.authorization?.replace("Bearer ", "").trim() ?? null;

  if (token) {
    try {
      const verifiedToken = await clerkClient.verifyToken(token);

      session = await clerkClient.sessions.getSession(verifiedToken.sid);

      user = await db.user.findUnique({
        where: { clerkId: session.userId },
      });

      if (!user) {
        const clerkUser = await clerkClient.users.getUser(session.userId);

        user = await db.user.create({
          data: {
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            name: clerkUser.username ?? "",
            clerkId: session.userId,
          },
        });
      }

      return {
        db,
        auth: { session, user },
      };
    } catch {
      return { db };
    }
  }

  return {
    db,
  };
};

export const createContext = async (opts: CreateContextOpts) => {
  const innerContext = await createContextInner({
    authorization:
      opts.req.headers.authorization ??
      opts.info.connectionParams?.Authorization,
    ...opts,
  });

  return {
    ...innerContext,
    req: opts.req,
    res: opts.res,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createContextInner>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev 100-500ms
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(async ({ ctx, next }) => {
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    if (!ctx.auth) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return next();
  });
