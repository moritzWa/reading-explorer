import axios from "axios";
import cheerio from "cheerio";
import OpenAI from "openai";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { DataForSEOBacklinkResponse } from "./types";

const openai = new OpenAI();

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

      return response.data.tasks[0].result as DataForSEOBacklinkResponse[];
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
          throw new Error(
            `Failed to fetch ${input.url}: ${response.statusText}`
          );
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
      } catch (error: any) {
        console.error(error);
        throw new Error(`Error fetching links: ${error.message}`);
      }
    }),
  compareTexts: publicProcedure
    .input(
      z.object({
        inputText: z.string(),
        comparisonText: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { inputText, comparisonText } = input;

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful comparison agent that takes an input text and a comparison text and determines whether the comparison text represents a 'similar' or 'constituent' relationship to the input text. A 'similar' text would help a person explore more about the topic of the input text, while a 'constituent' text would help a person understand the input text better.",
            },
            {
              role: "user",
              content: `Determine if the following comparison text helps in understanding (constituent) or explores beyond the input text (similar). Your output should {"classification": "similar"|"constituent"}. Input text: "${inputText}". Comparison text: "${comparisonText}".`,
            },
          ],
        });

        const parsedResponse = JSON.parse(response.choices[0].message.content);

        return parsedResponse;
      } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw new Error("Failed to analyze texts");
      }
    }),
  summarizeUrl: publicProcedure.input(z.object({ url: z.string().url() })).query(async ({ input }) => {
    const { url } = input;
    try {
      const response = await axios.post(
        "https://api.apyhub.com/ai/summarize-url",
        {
          url
        },
        {
          headers: {
            "apy-token": process.env.APYHUB_API_KEY,
            "Content-Type": "application/json",
          }
        }
      );

      return response.data
    } catch (error) {
      console.error("Error calling apyhub API:", error);
      throw new Error("Failed to summarize URL");
    }
  })
});

export type AppRouter = typeof appRouter;
