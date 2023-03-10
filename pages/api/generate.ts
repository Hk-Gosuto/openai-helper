import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";
import { OpenAIChatGPTStream, OpenAIChatGPTStreamPayload, OpenAIChatGPTMessagePayload } from "../../utils/OpenAIChatGPTStream";

if (process.env.NEXT_PUBLIC_USE_USER_KEY !== "true") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing env var from OpenAI");
  }
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  var { prompt, api_key } = (await req.json()) as {
    prompt?: string;
    api_key?: string
  };
  var p = ""
  prompt = p + prompt
  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  if (!process.env.OPENAI_MODEL) {
    throw new Error("Missing env var from OpenAI")
  }

  if (process.env.OPENAI_MODEL == 'gpt-3.5-turbo') {
    const messages: OpenAIChatGPTMessagePayload[] = [
      {
        role: 'user',
        content: prompt
      }
    ];
    const payload: OpenAIChatGPTStreamPayload = {
      model: process.env.OPENAI_MODEL,
      messages: messages,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1536,
      stream: true,
      n: 1,
      api_key
    };

    const stream = await OpenAIChatGPTStream(payload);
    return new Response(stream);
  }
  else {
    const payload: OpenAIStreamPayload = {
      model: process.env.OPENAI_MODEL,
      prompt,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 1536,
      stream: true,
      n: 1,
      api_key,
    }

    const stream = await OpenAIStream(payload);
    return new Response(stream);
  }
};

export default handler;
