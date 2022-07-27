import React from "react";
import styled from "styled-components";
import { MarkdownPreviewer } from "@osn/previewer";

const Wrapper = styled(MarkdownPreviewer)`
  color: ${(props) => props.theme.textPrimary};

  .markdown-body pre,
  .markdown-body code {
    background: ${(props) => props.theme.grey100Bg} !important;
    code {
      color: ${(props) => props.theme.textPrimary} !important;
      text-shadow: none !important;
    }
  }
`;

export default function MarkdownRenderer({ content }) {
  return <Wrapper content={content} />;
}
