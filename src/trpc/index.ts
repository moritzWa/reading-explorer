import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
});

export type AppRouter = typeof appRouter;
