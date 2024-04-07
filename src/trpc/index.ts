import OpenAI from "openai";
import { z } from "zod";
import { publicProcedure, router } from "./trpc";

const openai = new OpenAI();


export const appRouter = router({
  getHelloWorld: publicProcedure.query(async () => {
    return await {
      data: "world",
    };
  }),
  compareTexts: publicProcedure.input(z.object({
    inputText: z.string(),
    comparisonText: z.string(),
  })).query(async ({ input }) => {
    const { inputText, comparisonText } = input;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { "role": "system", "content": "You are a helpful comparison agent that takes an input text and a comparison text and determines whether the comparison text represents a 'similar' or 'constituent' relationship to the input text. A 'similar' text would help a person explore more about the topic of the input text, while a 'constituent' text would help a person understand the input text better." },
          { "role": "user", "content": `Determine if the following comparison text helps in understanding (constituent) or explores beyond the input text (similar). Your output should {"classification": "similar"|"constituent"}. Input text: "${inputText}". Comparison text: "${comparisonText}".` }
        ],
      });

      const parsedResponse = JSON.parse(response.choices[0].message.content);

      return parsedResponse
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw new Error("Failed to analyze texts");
    }
  }),
});

export type AppRouter = typeof appRouter;
