import styled from "styled-components";

import Markdown from "components/markdownPreview";

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
  const displayContent = content.replace(/\n+/g, function (ns) {
    if (ns.length === 1) return "  " + ns;
    return ns;
  });
  return (
    <Wrapper>
      <Markdown md={displayContent} setContent={setContent} />
    </Wrapper>
  );
}
