import React from "react";
import parse from "html-react-parser";
import styled from "styled-components";
import sanitizeHtml from "sanitize-html";
import { isAddress } from "@polkadot/util-crypto";

const Wrapper = styled.div`
  color: #000;
  width: 100%;
  max-width: min(48.5rem, calc(100vw - 50px));
  word-break: break-word;
  iframe {
    width: 480px;
    height: 300px;
    max-width: 100%;
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: 500;

    :not(:first-child) {
      margin-top: 0.25rem;
    }

    :not(:last-child) {
      margin-bottom: 0.25rem;
    }

    :last-child {
      margin-bottom: 0;
    }
  }

  h1 {
    line-height: 2rem;
    font-size: 1.25rem;
  }

  h2 {
    line-height: 1.875rem;
    font-size: 1.1875rem;
  }

  h3 {
    line-height: 1.75rem;
    font-size: 1.125rem;
  }

  h4 {
    line-height: 1.625rem;
    font-size: 1rem;
  }

  h5 {
    line-height: 1.5rem;
    font-size: 0.9375rem;
  }

  h6 {
    line-height: 1.375rem;
    font-size: 0.875rem;
  }

  p {
    margin-top: 0;
  }
  p,
  li {
    max-width: min(48.5rem, calc(100vw - 50px));
    word-break: break-word;
    font-size: 0.875rem;
    line-height: 1.375rem;
  }

  ol,
  ul {
    padding-left: 1.25rem;
  }

  ul {
    list-style-type: disc;
  }

  blockquote {
    margin: 0;
    padding-left: 0.75rem;
    border-left: 4px solid #eee;
  }

  pre {
    margin: 0;
    background: #eee !important;
    border-radius: 0.25rem;

    padding: 0.5em;
    color: rgb(101, 123, 131);
    white-space: pre-wrap !important;

    > code {
      padding: 0 !important;
      background: transparent !important;
    }
  }

  code {
    padding: 0 0.25rem;
    background: #eee;
    border-radius: 0.25rem;
    word-break: break-all;
  }

  a {
    color: #1f70c7;
  }

  span.disabled-link > a {
    color: #506176;
    pointer-events: none;
  }

  img {
    max-width: 100%;
  }

  .mention {
    background-color: transparent;
    padding: 0;
  }

  .mention a::selection {
    background-color: transparent !important;
    color: inherit;
  }
`;

function HtmlRender({ html }) {
  const r =
    /<span class="mention" data-denotation-char="@" data-id="([^"]+)" data-value="([^"]+)">.{0,1}<span><span class="ql-mention-denotation-char">@<\/span>[^<>]+<\/span>.{0,1}<\/span>/;
  while (html.match(r)) {
    const usernameOrAddr = html.match(r)[1];
    const display = html.match(r)[2];

    let mentionClass = "mention";
    if (!isAddress(usernameOrAddr)) {
      mentionClass += " disabled-link";
    }
    html = html.replace(
      r,
      `<span class="${mentionClass}"><a href="/member/${usernameOrAddr}" target="_blank">@${display}</a></span>`
    );
}
  const cleanHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "iframe"]),
    allowedAttributes: {
      img: ["src", "size", "width", "height"],
      iframe: ["src", "width", "height"],
      a: ["href", "rel", "target"],
      "*": ["class"],
    },
  });
  return <Wrapper className="post-content">{parse(cleanHtml)}</Wrapper>;
}

export default HtmlRender;
