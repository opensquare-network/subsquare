import { sanitizeHtmlPlugin } from "@osn/previewer";

export function sanitizeHtml(html) {
  return sanitizeHtmlPlugin().transformHtml(html);
}
