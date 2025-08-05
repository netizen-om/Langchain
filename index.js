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