import axios from "axios";
import cheerio from "cheerio";
import OpenAI from "openai";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { DataForSEOBacklinkResponse } from "./types";

const openai = new OpenAI();

// HELPERS
interface Link {
  url: string;
  title: string;
}
export interface LinkWithSummary {
  url: string;
  title: string;
  summary: string;
}
async function getBackLinks(link: string): Promise<Link[]> {
  const cred = Buffer.from(
    `${process.env.DATA_FOR_SEO_LOGIN}:${process.env.DATA_FOR_SEO_PASSWORD}`
  ).toString("base64");

  try {
    const response = await axios.post(
      "https://api.dataforseo.com/v3/backlinks/backlinks/live",
      [
        {
          target: link,
          mode: "as_is",
          filters: ["dofollow", "=", true],
          limit: 3,
        },
      ],
      {
        headers: {
          Authorization: `Basic ${cred}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract the items from the response
    const items = response.data.tasks[0].result[0].items;

    // Map the items to an array of Link objects
    const links: Link[] = items.map((item: any) => ({
      url: item.url_from,
      title: item.page_from_title,
    }));

    return links;
  } catch (error) {
    throw error;
  }
}

interface Summary {
  summary: string;
}
async function summarizeUrl(url: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.apyhub.com/ai/summarize-url",
      {
        url,
      },
      {
        headers: {
          "apy-token": process.env.APYHUB_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.summary;
  } catch (error) {
    console.log(error)
    throw new Error("Failed to summarize URL");
  }
}


async function getForwardLinks(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${url}: ${response.statusText}`
      );
    }
    const html = await response.text();
    const $ = cheerio.load(html);
    const links = $("a")
      .map((_: any, element: any) => $(element).attr("href"))
      .get()
      .filter((href: any) => href && href.startsWith("http"));
    return links
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error fetching getForwardLinks: ${error.message}`);
  }
}

// getBacklinks

// ROUTES
export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
  getAllLinks: publicProcedure.input(z.string()).query(async (req) => {
    const link = req.input as string;
    const backlinks = await getBackLinks(link);
    // const forwardlinks = await getForwardLinks(link);


    const allLinks = [...backlinks];

    const summarizedLinks: LinkWithSummary[] = [];

    for (const link of allLinks) {
      const summary = await summarizeUrl(link.url);
      summarizedLinks.push({
        url: link.url,
        title: link.title,
        summary: summary,
      });
    }

    return summarizedLinks;
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
        throw new Error(`Error fetching getForwardLinks: ${error.message}`);
      }
    }),
  // compareTexts: publicProcedure
  //   .input(
  //     z.object({
  //       inputText: z.string(),
  //       comparisonText: z.string(),
  //     })
  //   )
  //   .query(async ({ input }) => {
  //     const { inputText, comparisonText } = input;

  //     try {
  //       const response: any = await openai.chat.completions.create({
  //         model: "gpt-3.5-turbo",
  //         messages: [
  //           {
  //             role: "system",
  //             content:
  //               "You are a helpful comparison agent that takes an input text and a comparison text and determines whether the comparison text represents a 'similar' or 'constituent' relationship to the input text. A 'similar' text would help a person explore more about the topic of the input text, while a 'constituent' text would help a person understand the input text better.",
  //           },
  //           {
  //             role: "user",
  //             content: `Determine if the following comparison text helps in understanding (constituent) or explores beyond the input text (similar). Your output should {"classification": "similar"|"constituent"}. Input text: "${inputText}". Comparison text: "${comparisonText}".`,
  //           },
  //         ],
  //       });

  //       const parsedResponse = JSON.parse(response.choices[0].message.content);

  //       return parsedResponse;
  //     } catch (error) {
  //       console.error("Error calling OpenAI API:", error);
  //       throw new Error("Failed to analyze texts");
  //     }
  //   }),
  summarizeUrl: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(async ({ input }) => {
      const { url } = input;
      console.log("----URL", url)
      try {
        const response = await axios.post(
          "https://api.apyhub.com/ai/summarize-url",
          {
            url,
          },
          {
            headers: {
              "apy-token": process.env.APYHUB_API_KEY,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("res", response)

        return response.data;
      } catch (error) {
        console.error("Error calling apyhub API:", error);
        throw new Error("Failed to summarize URL");
      }
    }),
});

export type AppRouter = typeof appRouter;
