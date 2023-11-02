import sanitizeHtml from "sanitize-html";
import { openai } from ".";

export async function fetchSummary({ post, type }) {
  let summary = "";
  let content = "";

  if (post.contentType === "html") {
    content = cleanHtml(post.content);
  }
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

function cleanHtml(raw = "") {
  const ignoreTags = ["code"];

  let html = sanitizeHtml(raw, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter(
      (tag) => !ignoreTags.includes(tag),
    ),
    allowedAttributes: {},
  });

  // stripe html tags
  html = html.replace(/<[^>]*>/g, "");

  return html;
}
