import React from "react";
import styled from "styled-components";

const AnnotationText = styled.p`
  margin: 0;
  color: var(--textTertiary);
  font-size: 12px;
  line-height: 16px;
`;

export default function Annotation({ isOpenGov = false }) {
  if (isOpenGov) {
    return <AnnotationText>
      d: Delegation s: Split sa: SplitAbstain
    </AnnotationText>;
  }

  return <AnnotationText>
    d: Delegation s: Split
  </AnnotationText>;
}
