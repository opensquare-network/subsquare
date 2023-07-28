import styled from "styled-components";

const Wrapper = styled.span`
  color: var(--textTertiary);
  margin: 0 8px;
`;

export default function DotSplitter() {
  return <Wrapper>·</Wrapper>;
}
