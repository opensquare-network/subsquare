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

const defaultModelOptions = {
  // gpt-3.5-turbo
  // gpt-3.5-turbo-16k
  // gpt-4
  // gpt-4-16k
  model: "gpt-3.5-turbo",
  stream: false,
  // 0-1
  temperature: 0.3,
  max_tokens: 400,
};

async function openai({ provider = "openai", ...payload }, fetchOptions = {}) {
  let apiUrl = "";

  const headers = {};
  if (provider === "openai") {
    apiUrl = openaiUrl;
    headers.Authorization = `Bearer ${OPENAI_API_KEY}`;
  }
  if (provider === "azure-openai") {
    apiUrl = azureOpenaiUrl;
    headers["api-key"] = AZURE_OPENAI_API_KEY;
  }

  return await nextApi.post(
    apiUrl,
    {
      ...defaultModelOptions,
      ...payload,
    },
    {
      credentials: undefined,
      ...fetchOptions,
      headers: {
        ...headers,
        ...fetchOptions.headers,
      },
    },
  );
}

export async function fetchSummary({ post, type }) {
  let summary = "";
  let content = "";

  // TODO: post contentType html, stripe out html tags, keep `br`
  // TODO: post contentType markdown
  if (post.contentType === "markdown") {
    content = post.content;
  }

  if (!content) {
    return summary;
  }

  const resp = await openai({
    messages: [
      {
        role: "system",
        content: `I want you to act as a Wikipedia page.
Summarise SubSquare ${type} post content you are provided.
Instructions you must follow:
- For a second-grade student in 5 bullet points
- Don't give any redundant markdown
`,
      },
      {
        role: "user",
        content,
      },
    ],
  });

  if (resp.result) {
    const choices = resp.result.choices;
    summary = choices?.[0]?.message?.content?.trim?.();
  }

  if (resp.error) {
    throw resp.error;
  }

  return summary;
}
