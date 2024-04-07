import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(() => {
    return {
      data: "world",
    };
  }),
});

export type AppRouter = typeof appRouter;
