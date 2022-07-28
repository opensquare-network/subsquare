import styled from "styled-components";

const RichTextStyleWrapper = styled.div`
  color: ${(props) => props.theme.textPrimary};

  .html-body pre,
  .html-body code,
  .markdown-body pre,
  .markdown-body code {
    background: ${(props) => props.theme.grey100Bg} !important;
    code {
      color: ${(props) => props.theme.textPrimary} !important;
      text-shadow: none !important;
    }
  }
`;

export default RichTextStyleWrapper;
