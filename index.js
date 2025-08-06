import { tool } from "@langchain/core/tools";
import z from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const llm = new ChatGoogleGenerativeAI({
  apiKey : process.env.GOOGLE_GEMINI_API_KEY,
  model : "gemini-2.0-flash"
})

const multiply = tool(async(({a, b}) => {
    return a*b;
}), {
    name : 'multiply',
    description : 'multiply two numbers',
    schema : z.object({
        a : z.number().describe("First Number"),
        b : z.number().describe("Second Number")
    })
})

const add = tool(
  async ({ a, b }) => {
    return a + b;
  },
  {
    name: "add",
    description: "Add two numbers together",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

const divide = tool(
  async ({ a, b }) => {
    return a / b;
  },
  {
    name: "divide",
    description: "Divide two numbers",
    schema: z.object({
      a: z.number().describe("first number"),
      b: z.number().describe("second number"),
    }),
  }
);

// Augment the LLM with tools
const tools = [add, multiply, divide];
const toolsByName = Object.fromEntries(tools.map((tool) => [tool.name, tool]));
const llmWithTools = llm.bindTools(tools);