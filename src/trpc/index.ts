import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
  getBackLinks: publicProcedure.query(async () => {
    return await {
      data: [
        {
          link: "https://www.google.com/",
          title: "Google",
        },
        {
          link: "https://www.bing.com/",
          title: "Bing",
        },
      ],
    };
  }),
});

export type AppRouter = typeof appRouter;
