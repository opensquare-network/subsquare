import styled from "styled-components";
import dynamic from "next/dynamic";

const Markdown = dynamic(
  () => import("components/markdownPreview").catch((e) => console.error(e)),
  { ssr: false }
);

const Wrapper = styled.div`
  min-height: 245px;
  padding-left: 1rem;
  border-left: 0.25rem solid #f2f2f2;
  > :not(:first-child) {
    margin-top: 1rem;
  }
  > * {
    margin-bottom: 0 !important;
  }
`;

export default function PreviewMD({ content, setContent }) {
  return (
    <Wrapper>
      <Markdown md={content} setContent={setContent} />
    </Wrapper>
  );
}
