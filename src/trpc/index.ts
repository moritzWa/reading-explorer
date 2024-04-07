import cheerio from "cheerio";
import fetch from "node-fetch";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
  getForwardLinks: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      try {
        const response = await fetch(input.url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${input.url}: ${response.statusText}`);
        }
        const html = await response.text();
        const $ = cheerio.load(html);
        const links = $("a")
          .map((_: any, element: any) => $(element).attr("href"))
          .get()
          .filter((href: any) => href && href.startsWith("http"));
        return {
          data: links,
        };
      } catch (error) {
        console.error(error);
        throw new Error(`Error fetching links: ${error.message}`);
      }
    }),
});

export type AppRouter = typeof appRouter;
