import React from "react";
import styled from "styled-components";
import { hexEllipsis } from "next-common/utils";

const Between = styled.div`
  display: flex;
  > :not(:first-child) {
    margin-left: 24px;
  }
`;

const A = styled.a`
  color: var(--theme500);
`;

export default function LongText({ text, fileName = "hex", maxLength = 200 }) {
  if (text?.length <= maxLength) {
    return text;
  }
  const blob = new Blob([text], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  return (
    <Between>
      <span>{hexEllipsis(text)}</span>
      <A href={url} download={fileName}>
        Download
      </A>
    </Between>
  );
}
