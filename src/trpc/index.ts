import axios from "axios";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { DataForSEOBacklinkResponse } from "./types";

export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
  getBackLinks: publicProcedure.input(z.string()).query(async (req) => {
    const link = req.input;
    const cred = Buffer.from(
      `${process.env.DATA_FOR_SEO_LOGIN}:${process.env.DATA_FOR_SEO_PASSWORD}`
    ).toString("base64");

    console.log("link", link);
    console.log("cred", cred);

    try {
      const response = await axios.post(
        "https://api.dataforseo.com/v3/backlinks/backlinks/live",
        [
          {
            target: link,
            mode: "as_is",
            filters: ["dofollow", "=", true],
            limit: 10,
          },
        ],
        {
          headers: {
            Authorization: `Basic ${cred}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response.data", response.data);

      return response.data.tasks[0].result as DataForSEOBacklinkResponse;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
