import React from "react";
import styled from "styled-components";
import { HtmlPreviewer } from "@osn/previewer";

const Wrapper = styled(HtmlPreviewer)`
  color: ${(props) => props.theme.textPrimary};

  .html-body pre,
  .html-body code {
    background: ${(props) => props.theme.grey100Bg} !important;
    code {
      color: ${(props) => props.theme.textPrimary} !important;
      text-shadow: none !important;
    }
  }
`;

export default function HtmlRenderer({ content }) {
  return <Wrapper content={content} />;
}
