import { tool } from "@langchain/core/tools";
import z from "zod";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ToolMessage } from "@langchain/core/messages";

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

// Nodes
async function llmCall(state) {
  // LLM decides whether to call a tool or not
  const result = await llmWithTools.invoke([
    {
      role: "system",
      content: "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
    },
    ...state.messages
  ]);

  return {
    messages: [result]
  };
}

async function toolNode(state) {
  const result  = [];
  const lastMessage = state.messages.at(-1);

  if(lastMessage?.tool_calls?.length) {
    for(const toolCall of lastMessage.tool_call) {
      const tool = toolsByName[toolCall.name];
      const observation = await tool.invoke(toolCall.args);
      result.push(
        new ToolMessage({
          content : observation,
          tool_call_id : toolCall.id
        })
      )
    }
  }

  return { messages : result };
}

function shouldContinue(state) {
  const messages = state.messages;
  const lastMessage = messages.at(-1);

  // If the LLM makes a tool call, then perform an action
  if (lastMessage?.tool_calls?.length) {
    return "Action"; 
  }
  // Otherwise, we stop (reply to the user)
  return "__end__";
}