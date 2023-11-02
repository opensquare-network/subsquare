import nextApi from "./nextApi";

const OPENAI_API_END_POINT =
  process.env.NEXT_PUBLIC_OPENAI_API_END_POINT || "https://api.openai.com";
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const AZURE_OPENAI_RESOURCE_NAME =
  process.env.NEXT_PUBLIC_AZURE_OPENAI_RESOURCE_NAME;
const AZURE_OPENAI_DEPLOYMENT_ID =
  process.env.NEXT_PUBLIC_AZURE_OPENAI_DEPLOYMENT_ID;
const AZURE_OPENAI_API_VERSION =
  process.env.NEXT_PUBLIC_AZURE_OPENAI_API_VERSION;
const AZURE_OPENAI_API_KEY = process.env.NEXT_PUBLIC_AZURE_OPENAI_API_KEY;

const openaiUrl = OPENAI_API_END_POINT + "/v1/chat/completions";
const azureOpenaiUrl = `https://${AZURE_OPENAI_RESOURCE_NAME}.openai.azure.com/openai/deployments/${AZURE_OPENAI_DEPLOYMENT_ID}/chat/completions?api-version=${AZURE_OPENAI_API_VERSION}`;

const PROMPT = `I want you to act as a Wikipedia page.
I will give you a post content and you will write a summary of it.
intructions you must follow:
- Don't copy the original text
- Don't include any code
- Start with "This post is"
`;

const openaiModelOptions = {
  // gpt-3.5-turbo
  // gpt-3.5-turbo-16k
  // gpt-4
  // gpt-4-16k
  model: "gpt-3.5-turbo",
  stream: false,
  // 0-1
  temperature: 0.3,
};

export async function aiSummarise({ provider = "openai", post }) {
  let summary = "";
  let apiUrl = "";
  let content = "";

  // TODO: post contentType html, stripe out html tags, keep `br`
  // TODO: post contentType markdown
  if (post.contentType === "markdown") {
    content = post.content;
  }

  if (!content) {
    return summary;
  }

  const headers = {};
  if (provider === "openai") {
    apiUrl = openaiUrl;
    headers.Authorization = `Bearer ${OPENAI_API_KEY}`;
  }
  if (provider === "azure-openai") {
    apiUrl = azureOpenaiUrl;
    headers["api-key"] = AZURE_OPENAI_API_KEY;
  }

  const resp = await nextApi.post(
    apiUrl,
    {
      ...openaiModelOptions,
      messages: [
        {
          role: "system",
          content: PROMPT,
        },
        {
          role: "user",
          content,
        },
      ],
    },
    {
      headers,
      credentials: undefined,
    },
  );

  if (resp.result) {
    const choices = resp.result.choices;
    summary = choices?.[0]?.message?.content?.trim?.();
  }

  if (resp.error) {
    throw resp.error;
  }

  return summary;
}
