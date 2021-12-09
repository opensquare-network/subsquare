import styled from "styled-components";
import ReactMarkdown from "react-markdown";

import CodeBlock from "components/codeBlock";
import ImgRender from "components/markdown/imgRender";
import { matchMdLink } from "utils/index";
import remarkGfm from "remark-gfm";

const Wrapper = styled.div`
  .markdown-content {
    color: #000;
    max-width: 48.5rem;
    word-break: normal;

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

    p,
    li {
      max-width: 48.5rem;
      font-size: 0.875rem;
      line-height: 1.375rem;
      word-break: break-word;
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
      padding: 0 0.75rem;
      background: #eee !important;
      border-radius: 0.25rem;
      white-space: pre-wrap !important;

      > code {
        padding: 0 !important;
        background: transparent !important;
        white-space: pre-wrap !important;
      }
    }

    code {
      padding: 0 0.25rem;
      background: #eee;
      border-radius: 0.25rem;
      word-break: break-all;
    }

    a {
      color: #0974cd;
    }

    img {
      max-width: 100%;
    }

    p a::selection {
      background-color: transparent !important;
      color: inherit;
    }

    table,
    th,
    td {
      border: 1px solid black !important;
    }
    table {
      border-collapse: collapse;
    }
  }
`;

const Markdown = ({ md, contentVersion = "" }) => {
  const matchLinkMd = matchMdLink(md);
  let displayContent = matchLinkMd;
  if (contentVersion === "2") {
    displayContent = md.replace(/\n+/g, function (ns) {
      if (ns.length === 1) return "  " + ns;
      return ns;
    });
  }
  return (
    <Wrapper>
      <ReactMarkdown
        className="markdown-content"
        renderers={{
          code: CodeBlock,
          image: ImgRender,
        }}
        linkTarget="_blank"
        remarkPlugins={[remarkGfm]}
      >
        {displayContent}
      </ReactMarkdown>
    </Wrapper>
  );
};

export default Markdown;
