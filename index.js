import { tool } from "@langchain/core/tools";
import z from "zod";

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