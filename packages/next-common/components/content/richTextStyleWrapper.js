import styled, { css } from "styled-components";

const RichTextStyleWrapper = styled.div`
  color: ${(props) => props.theme.textPrimary};

  div.ql-editor,
  div.html-body,
  div.markdown-body {
    table tbody {
      tr th {
        background: ${(props) => props.theme.grey200Border};
      }

      tr:nth-child(even) {
        background: ${(props) => props.theme.grey100Bg};
      }

      th,
      td {
        border-color: ${(props) => props.theme.grey300Border};
        color: ${(props) => props.theme.textPrimary};
      }
    }

    pre,
    code {
      background: ${(props) => props.theme.grey100Bg} !important;
      // fixme: undone !import declare in editor repo
      background-color: ${(props) => props.theme.grey100Bg} !important;
      color: ${(props) => props.theme.textPrimary} !important;

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
`;

export default RichTextStyleWrapper;
