import { streamText, stepCountIs, convertToModelMessages } from "ai";
import { LORE_SYSTEM_PROMPT, chatTools } from "./chatConfig";
import { chatModel } from "@/constants/ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const modelMessages = await convertToModelMessages(messages);

    // Stream the response. NOTE: We do not save any messages to Neon!
    const result = await streamText({
      model: chatModel,
      system: LORE_SYSTEM_PROMPT,
      messages: modelMessages,
      stopWhen: stepCountIs(5), // Allows the LLM to run tools, receive results, and formulate the final response
      tools: chatTools,
    });

    return result.toUIMessageStreamResponse({ originalMessages: messages });
  } catch (error) {
    console.error("Simple stateless chat stream failed:", error);
    return new Response(JSON.stringify({ error: "Failed to process chat" }), {
      status: 500,
    });
  }
}
