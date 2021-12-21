import styled, { css } from "styled-components";
import Markdown from "components/micromarkMd";

const Wrapper = styled.div`
  min-height: 245px;
  padding-left: 1rem;
  border-left: 0.25rem solid #f2f2f2;
  width: 100%;

  > :not(:first-child) {
    margin-top: 1rem;
  }

  > * {
    margin-bottom: 0 !important;
  }

  ${(p) =>
          p.maxHeight &&
          css`
            max-height: ${p.maxHeight + 43}px;
            overflow-y: scroll;
          `}
`;

export default function PreviewMD({content, maxHeight = null}) {
  return (
    <Wrapper maxHeight={maxHeight >= 300 ? 300 : maxHeight}>
      <Markdown md={content} contentVersion="2"/>
    </Wrapper>
  );
}
