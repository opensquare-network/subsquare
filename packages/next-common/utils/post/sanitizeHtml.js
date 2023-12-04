const { sanitizeHtmlPlugin } = require("@osn/previewer");

export function sanitizeHtml(html) {
  return sanitizeHtmlPlugin().transformHtml(html);
}
