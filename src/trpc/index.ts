import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(() => {
    return "hello world";
  }),
});

export type AppRouter = typeof appRouter;
