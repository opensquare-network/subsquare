import styled, { css } from "styled-components";

const RichTextStyleWrapper = styled.div`
  color: ${(props) => props.theme.textPrimary};

  div.ql-editor,
  div.html-body,
  div.markdown-body {
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
