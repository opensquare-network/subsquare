import styled, { css } from "styled-components";

const RichTextStyleWrapper = styled.div`
  color: var(--textPrimary);

  div.osn-previewer > div {
    color: var(--textPrimary);
    //fixme: @osn-previewer has built-in CSS text color, better remove it later
  }

  div.ql-editor,
  div.html-body,
  div.markdown-body {
    hr {
      background-color: var(--neutral300);
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    span.mention,
    span.mention span {
      background-color: var(--neutral100);
      color: var(--sapphire500);
    }

    blockquote {
      border-color: var(--neutral300);
    }

    ol > li[data-list="bullet"]::before {
      content: "•";
    }

    li {
      word-break: break-word;
    }

    table {
      text-align: center;
      thead tr th {
        background: var(--neutral300);
        border-color: var(--neutral400);
        color: var(--textPrimary);
      }
    }
    table tbody {
      tr:nth-child(even) {
        background: var(--neutral200);
      }

      th,
      td {
        border-color: var(--neutral400);
        color: var(--textPrimary);
      }
    }

    pre,
    code {
      background: var(--neutral200) !important;
      // fixme: undone !import declare in editor repo
      background-color: var(--neutral200) !important;
      color: var(--textPrimary) !important;

      ${(props) =>
        props?.theme.isDark &&
        css`
          text-shadow: none !important;
        `};
    }
  }

  div.ql-editor pre {
    margin-top: 8px !important;
    margin-bottom: 8px !important;
    padding-left: 8px !important;
    line-height: 24px;
  }

  p {
    margin-top: 1em;
    margin-bottom: 1em;
  }

  ol {
    list-style-type: decimal;
    padding-left: 2em !important;
  }
  ul {
    padding-left: 2em !important;
  }
`;

export default RichTextStyleWrapper;
