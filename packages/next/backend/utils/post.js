const cheerio = require("cheerio");
const xss = require("xss");
const { ContentType } = require("../constants");

const xssOptions = {
  whiteList: {
    p: ["class"],
    span: ["class", "data-denotation-char", "data-id", "data-value"],
    br: [],
    blockquote: ["class"],
    pre: ["class"],
    ol: [],
    ul: [],
    li: ["class"],
    strong: [],
    em: [],
    u: [],
    s: [],
    a: ["href", "title", "target", "rel"],
    h1: ["class"],
    h2: ["class"],
    h3: ["class"],
    h4: ["class"],
    h5: ["class"],
    h6: ["class"],
    img: ["src", "width", "class"],
    iframe: ["src"],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script"],
};

const myXss = new xss.FilterXSS(xssOptions);
function safeHtml(html) {
  return myXss.process(html);
}


function extractMentions(content, contentType) {
  const mentions = new Set();
  if (contentType === ContentType.Markdown) {
    const reMention = /\[@(\w+)\]\(\/member\/(\w+)\)/g;
    let match;
    while ((match = reMention.exec(content)) !== null) {
      const [, u1, u2] = match;
      if (u1 === u2) {
        mentions.add(u1);
      }
    }
  }

  if (contentType === ContentType.Html) {
    const $ = cheerio.load(content);
    $(".mention").each((i, el) => {
      const at = $(el).attr("data-id");
      if (at) {
        mentions.add(at);
      }
    });
  }

  return mentions;
}

module.exports = {
  safeHtml,
  extractMentions,
};
