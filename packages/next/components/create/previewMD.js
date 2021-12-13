import styled from "styled-components";
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
`;

export default function PreviewMD({ content }) {
  return (
    <Wrapper>
      <Markdown md={content} contentVersion="2" />
    </Wrapper>
  );
}
